(()=> {
function scriptFixer(node) {
    node.querySelectorAll("script").forEach(script => {
        script.parentNode.insertBefore(
            document.createElement("script").appendChild(document.createTextNode(script.innerHTML)).parentNode,
            script
        );
        script.remove();
    });

    return node;
}

const eventSubscriptionList = {
    renderStart: [],
    renderEnd: [],
    eachStructRenderStart: [],
    eachStructRenderEnd: [],
    eachTemplateRenderStart: [],
    eachTemplateRenderEnd: [],
    eachDataRenderStart: [],
    eachDataRenderEnd: []
}

function addMediaEventHandlers(node) {
    for ([eventName, callback] of [
        ["play", event => {
            event.target.classList.remove("error");
            event.target.classList.remove("waiting");
            event.target.classList.remove("ended");
            event.target.classList.remove("pause");
            event.target.classList.add("play");
        }],
        ["playing", event => {
            event.target.classList.remove("error");
            event.target.classList.remove("waiting");
            event.target.classList.remove("ended");
            event.target.classList.remove("pause");
            event.target.classList.add("play");
        }],
        ["pause", event => {
            event.target.classList.remove("play");
            event.target.classList.add("pause");
        }],
        ["ended", event => {
            event.target.classList.remove("play");
            event.target.classList.remove("pause");
            event.target.classList.add("ended");
        }],
        ["waiting", event => {
            event.target.classList.remove("play");
            event.target.classList.add("waiting");
        }],
        ["loadeddata", event => {
            event.target.classList.remove("waiting");
        }],
        ["error", event => {
            event.target.classList.remove("play");
            event.target.classList.add("error");
        }],
    ]) {
        node.addEventListener(eventName, callback);
    }
}

function cloneAttributes(targetNode, sourceNode) {
    for (let i = 0; i < sourceNode.attributes.length; i++)
        targetNode.setAttribute(
            sourceNode.attributes[i].name,
            sourceNode.attributes[i].value
        );
}

function elementRenderPublisher(eventName, oldNode, newNode) {
    eventSubscriptionList[eventName].forEach(callback => callback(eventName, oldNode, newNode));
}

const dataTypes = {
    iframe(node, mimetype) {
        const newNode = document.createElement("iframe");
        elementRenderPublisher("eachDataRenderStart", node, newNode);
        cloneAttributes(newNode, node);
        newNode.setAttribute("loading", "lazy");
        newNode.classList.add("loading");
        newNode.addEventListener("load", event => {
            newNode.classList.remove("loading");
            newNode.classList.add("loaded");
        });
        node.replaceWith(newNode);
        newNode.src = node.innerText;
        elementRenderPublisher("eachDataRenderEnd", node, newNode);
    },
    video(node, mimetype) {
        const sourceNode = document.createElement("source");
        sourceNode.setAttribute("src", node.innerText);
        sourceNode.setAttribute("type", mimetype);

        const newNode = document.createElement("video");
        elementRenderPublisher("eachDataRenderStart", node, newNode);
        cloneAttributes(newNode, node);
        addMediaEventHandlers(newNode);
        newNode.setAttribute("loading", "lazy");
        newNode.appendChild(sourceNode);

        elementRenderPublisher("eachDataRenderEnd", node, newNode);
        node.replaceWith(newNode);
    },
    image(node, mimetype) {
        const newNode = document.createElement("img");
        elementRenderPublisher("eachDataRenderStart", node, newNode);
        cloneAttributes(newNode, node);
        newNode.setAttribute("loading", "lazy");
        newNode.classList.add("loading");
        newNode.addEventListener("load", event => {
            newNode.classList.remove("loading");
            newNode.classList.add("loaded");
        });
        newNode.setAttribute("type", mimetype);
        newNode.setAttribute("src", node.innerText);

        elementRenderPublisher("eachDataRenderEnd", node, newNode);
        node.replaceWith(newNode);
    },
    audio(node, mimetype) {
        const sourceNode = document.createElement("source");
        sourceNode.setAttribute("src", node.innerText);
        sourceNode.setAttribute("type", mimetype);

        const newNode = document.createElement("audio");
        elementRenderPublisher("eachDataRenderStart", node, newNode);
        cloneAttributes(newNode, node);
        addMediaEventHandlers(newNode);
        newNode.setAttribute("loading", "lazy");
        newNode.appendChild(sourceNode);

        elementRenderPublisher("eachDataRenderEnd", node, newNode);
        node.replaceWith(newNode);
    },
    async html(node, mimetype) {
        elementRenderPublisher("eachDataRenderStart", node);

        const request = new Request(node.innerText);
        while (node.lastChild) node.lastChild.remove();
        const response = await fetch(request);
        if (!response.ok) return node.outerHTML = node.outerHTML.replace(node.localName, `${node.localName}-error`);
        const data = await response.text();
        const dataCont = node.parentNode.cloneNode();
        dataCont.innerHTML = data;
        Array.prototype.forEach.call(dataCont.children, child => cloneAttributes(child, node));

        elementRenderPublisher("eachDataRenderEnd", node, dataCont.childNodes);
        node.replaceWith(...dataCont.childNodes);
    },
    script(node, mimetype) {
        const newNode = document.head.appendChild(document.createElement("script"));
        elementRenderPublisher("eachDataRenderStart", node, newNode);
        cloneAttributes(newNode, node);
        newNode.setAttribute("type", mimetype);
        newNode.setAttribute("src", node.innerText);

        elementRenderPublisher("eachDataRenderEnd", node, newNode);
        node.remove();
    },
    style(node, mimetype) {
        const newNode = document.head.appendChild(document.createElement("link"));
        elementRenderPublisher("eachDataRenderStart", node, newNode);
        cloneAttributes(newNode, node);
        newNode.setAttribute("rel", "stylesheet");
        newNode.setAttribute("href", node.innerText);

        elementRenderPublisher("eachDataRenderEnd", node, newNode);
        node.remove();
    }
}

const support = {
    defs: {
        struct: {
            "row": "display:flex;flex-direction:row;",
            "col": "display:flex;flex-direction:column;",
            "wor": "display:flex;flex-direction:row-reverse;",
            "loc": "display:flex;flex-direction:column-reverse;"
        },
        data: {
            "ogv":  [dataTypes.video,   "video/ogg"],
            "webm": [dataTypes.video,   "video/webm"],
            "mp4":  [dataTypes.video,   "video/mp4"],

            "png":  [dataTypes.image,   "image/png"],
            "jpg":  [dataTypes.image,   "image/jpeg"],
            "jpeg": [dataTypes.image,   "image/jpeg"],
            "ico":  [dataTypes.image,   "image/x-icon"],
            "bmp":  [dataTypes.image,   "image/bmp"],
            "gif":  [dataTypes.image,   "image/gif"],
            "svg":  [dataTypes.image,   "image/svg+xml"],

            "oga":  [dataTypes.audio,   "audio/ogg"],
            "ogg":  [dataTypes.audio,   "audio/ogg"],
            "mp3":  [dataTypes.audio,   "audio/mpeg"],

            "html": [dataTypes.html,    "text/html"],
            "txt":  [dataTypes.html,    "text/html"],

            "js":   [dataTypes.script,  "text/javascript"],

            "css":  [dataTypes.style,   "text/css"]
        }
    },
    elements: {
        template({node, templates}) {
            if (!node.attributes.length || !templates[node.attributes[0].name]) {
                console.error("Template not found: ", node);
                node.outerHTML = node.outerHTML.replace(node.localName, `${node.localName}-error`);
                return;
            }
    
            const template = templates[node.attributes[0].name].cloneNode(true);

            elementRenderPublisher("eachTemplateRenderStart", node, template);
    
            template.querySelectorAll("slot")
                .forEach(slot => slot.outerHTML = 
                    (src => src ? src.innerHTML : slot.outerHTML)
                        ( slot.attributes.length ? node.content.querySelector(slot.attributes[0].name) : null)
                );
                
            node.outerHTML = template.innerHTML;
    
            elementRenderPublisher("eachTemplateRenderEnd", node, template);
        },
        struct({node}) {
            let newNode;
            if (node.attributes[1]) newNode = document.createElement(node.attributes[1].name);
            else newNode = document.createElement("div");

            elementRenderPublisher("eachStructRenderStart", node, newNode);
    
            newNode.prepend(...node.childNodes);

            const className = createClassName(node);
            newNode.classList.add("struct", className);
            addMissingStyles(className);

            elementRenderPublisher("eachStructRenderEnd", node, newNode);
            node.replaceWith(newNode);
        },
        data({node}) {
            let fileType = node.innerText.slice((Math.max(0, node.innerText.lastIndexOf(".")) || Infinity) + 1);
            if (support.defs.data[fileType]) {
                node.classList.add("async", "file", `file--${fileType}`);
                support.defs.data[fileType][0](node, support.defs.data[fileType][1]);
            } else dataTypes.iframe(node, "");
        }
    }
};

support.selectorAll = `:is(${Object.keys(support.elements).join(", ")}):not(.async)`;

function getCssMediaQuery(breakpoint) {
    return breakpoint.split("_").reduce((mediaQuery, rule) => {
        if (rule.includes("w")) return mediaQuery += `(min-width: ${rule.slice(0, -1)}px)`;
        if (rule.includes("h")) return mediaQuery += `(min-height: ${rule.slice(0, -1)}px)`;
        return mediaQuery += ` ${rule.replace("or",",")} `;
    },"");
}

function createClassName(node) {
    if (!node.attributes.length) return "col";
    return node.attributes[0].name
        .replace("?","_or_")
        .replace("!","_and_");
}

function createCssFromClassName(className) {
    return className.split("-").reduce((acc, part, i) => {
        part = part + "";
        if (!acc) acc = "";

        if (i == 0) 
            acc += `.${className}{${support.defs.struct[part]}}`;

        if (i % 2)
            acc += ` @media ${getCssMediaQuery(part)}{.${className}{!mediaQueryStylesHere!}}`;
        else 
            acc = acc.replace("!mediaQueryStylesHere!", support.defs.struct[part]);

        return acc;
    },"");
}

function createTemplateCollection(templatesMarkup) {
    if (!templatesMarkup.length) return {};

    const templates = {};

    const tempRoot = document.createElement("div");
    tempRoot.innerHTML = templatesMarkup;

    Array.prototype.forEach.call(
        tempRoot.children,
        template => templates[template.localName.substring(template.localName.indexOf('-')+1)] = template.cloneNode(true)
    );

    return templates;
}

function addMissingStyles(className) {
    if (slang.styles.classList.contains(className)) return;
    slang.styles.node.innerHTML += createCssFromClassName(className);
    slang.styles.classList.add(className);
}

function createNodesFromMarkup(tempRoot, markup, templates) {
    const root = tempRoot.cloneNode();
    root.innerHTML = markup;

    let queue = root.querySelectorAll(support.selectorAll);
    while (queue.length) {
        queue.forEach(node => support.elements[node.localName]({node, templates}));
        queue = root.querySelectorAll(support.selectorAll);
    }

    return scriptFixer(root);
}

function createPublicProperty(value) {
    return {
        writable: false,
        value
    };
}

function createPublicProperties() {
    return {
        styles: createPublicProperty({
            node: document.head.appendChild(document.createElement("style")),
            classList: document.createElement("null-node").classList
        }),
        subscribe: createPublicProperty((eventName, callback) => {
            if (!eventSubscriptionList[eventName]) return;
            if (eventSubscriptionList[eventName].includes(callback)) return;
            eventSubscriptionList[eventName].push(callback);
        }),
        unsubscribe: createPublicProperty((eventName, callback) => {
            if (!eventSubscriptionList[eventName]) return;
            if (!eventSubscriptionList[eventName].includes(callback)) return;
            eventSubscriptionList[eventName].splice(eventSubscriptionList[eventName].indexOf(callback), 1);
        })
    };
}

function markupRenderer(contentMarkup, templatesMarkup, outputContainer) {
    if (!contentMarkup.length) return;

    const templates = createTemplateCollection(templatesMarkup);
    if (!outputContainer) outputContainer = document.createElement("div");

    eventSubscriptionList.renderStart.forEach(callback => callback({
        eventName: "renderStart",
        outputContainer,
        templates
    }));

    while (outputContainer.lastChild) outputContainer.lastChild.remove();
    outputContainer.prepend(...createNodesFromMarkup(outputContainer, contentMarkup, templates).childNodes);

    eventSubscriptionList.renderEnd.forEach(callback => callback({
        eventName: "renderEnd",
        outputContainer
    }));

    return outputContainer;
}

window.slang = (
    slangMarkup = "",
    templatesString = "",
    outputContainer
) => markupRenderer(slangMarkup, templatesString, outputContainer);

Object.defineProperties(slang, createPublicProperties());
})();
