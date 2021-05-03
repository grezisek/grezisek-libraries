const slang = (
    slangMarkup = "",
    templatesString = "",
    outputContainer

) => slang.renderer(slangMarkup, templatesString, outputContainer);

(()=> {
function structClassProcessor(retNode, className) {
    retNode.classList.add("struct", className);

    if (slang.styles.classList.contains(className)) return;

    slang.styles.node.innerHTML += className.split("-").reduce((acc, part, i) => {
        part = part + "";
        if (!acc) acc = "";

        if (i % 2 == 0) {
            if (!acc.includes("!mediaQueryHere!")) acc += `.${className}{${props.structDefs[part]}}`;
            else acc = acc.replace("!mediaQueryHere!", props.structDefs[part]);
        } else acc += ` @media ${props.getMediaRule(part, part.includes("_and_"), part.includes("_or_"))}{.${className}{!mediaQueryHere!}}`;

        return acc;
    },"");

    slang.styles.classList.add(className);
}

function templateRenderer(templatesMarkup) {
    if (!templatesMarkup.length) return {};

    const tempRoot = document.createElement("div");
    tempRoot.innerHTML = templatesMarkup;

    const templates = {};

    Array.prototype.forEach.call(
        tempRoot.children,
        template => templates[template.localName.substring(template.localName.indexOf('-')+1)] = template.cloneNode(true)
    );

    return templates;
}

function markupTranslator(tempRoot, slangMarkup, templates) {
    const root = tempRoot.cloneNode();
    root.innerHTML = slangMarkup;

    let queue = root.querySelectorAll(props.renderMethods.domQuery);
    while (queue.length) {
        queue.forEach(node => props.renderMethods[node.localName]({node, templates}));
        queue = root.querySelectorAll(props.renderMethods.domQuery);
    }

    root.querySelectorAll("script").forEach(script => {
        script.parentNode.insertBefore(
            document.createElement("script").appendChild(document.createTextNode(script.innerHTML)).parentNode,
            script
        );
        script.remove();
    });

    return root;
}

function markupRenderer(contentMarkup, templatesMarkup, outputContainer) {
    if (!contentMarkup.length) return;

    const templates = templateRenderer(templatesMarkup);
    if (!outputContainer) outputContainer = document.createElement("div");

    props.publishers.renderStart.forEach(callback => callback({
        eventName: "renderStart",
        outputContainer,
        templates
    }));

    while (outputContainer.lastChild) outputContainer.lastChild.remove();
    outputContainer.prepend(...markupTranslator(outputContainer, contentMarkup, templates).childNodes);

    props.publishers.renderEnd.forEach(callback => callback({
        eventName: "renderEnd",
        outputContainer
    }));

    return outputContainer;
};

function createProperties() {
    const p = {
        structDefs: {
            "row": "display:flex;flex-direction:row;",
            "col": "display:flex;flex-direction:column;",
            "wor": "display:flex;flex-direction:row-reverse;",
            "loc": "display:flex;flex-direction:column-reverse;"
        },
        renderMethods: {
            template({node, templates}) {
                if (!node.attributes.length || !templates[node.attributes[0].name]) {
                    console.error("Template not found: ", node);
                    node.outerHTML = node.outerHTML.replace(node.localName, `${node.localName}-notfound`);
                    return;
                }
    
                const template = templates[node.attributes[0].name].cloneNode(true);

                props.publishers.eachTemplateRenderStart.forEach(callback => callback({
                    eventName: "eachTemplateRenderStart",
                    node,
                    template
                }));

                template.querySelectorAll("slot")
                    .forEach(slot => slot.outerHTML = 
                        (src => src ? src.innerHTML : slot.outerHTML)
                            ( slot.attributes.length ? node.content.querySelector(slot.attributes[0].name) : null)
                    );
                    
                node.outerHTML = template.innerHTML;

                props.publishers.eachTemplateRenderEnd.forEach(callback => callback({
                    eventName: "eachTemplateRenderEnd",
                    template: node
                }));
            },
            struct({node}) {
                let returnNode;
        
                if (node.attributes[1]) returnNode = document.createElement(node.attributes[1].name);
                else returnNode = document.createElement("div");

                props.publishers.eachStructRenderStart.forEach(callback => callback({
                    eventName: "eachStructRenderStart",
                    node,
                    struct: returnNode
                }));
        
                returnNode.prepend(...node.childNodes);
                structClassProcessor(returnNode, node.attributes.length ? node.attributes[0].name.replace("?","_or_").replace("!","_and_") : "col");
                node.outerHTML = returnNode.outerHTML;

                props.publishers.eachStructRenderEnd.forEach(callback => callback({
                    eventName: "eachStructRenderEnd",
                    struct: node
                }));
            }
        },
        styles: {
            node: document.head.appendChild(document.createElement("style")),
            classList: document.createElement("null-node").classList
        },
        publishers: {
            renderStart: [],
            renderEnd: [],
            eachStructRenderStart: [],
            eachStructRenderEnd: [],
            eachTemplateRenderStart: [],
            eachTemplateRenderEnd: [],
        },
        getMediaRule(part, isAnd, isOr) {
            if (isAnd) part = part.split("_and_");
            if (isOr) part = part.split("_or_");
            return part.map(rule => {
                if (!rule.includes("h")) return `(min-width: ${parseInt(rule)}px)`
                else return `(min-height: ${parseInt(rule)}px)`
            }).join(isAnd ? " and " : isOr ? ", " : "" );
        },
        public: {
            renderer: {
                writable: false,
                value: markupRenderer
            },
            subscribe: {
                writable: false,
                value: (eventName, callback) => {
                    if (!p.publishers[eventName]) return;
                    if (p.publishers[eventName].includes(callback)) return;
                    p.publishers[eventName].push(callback);
                }
            },
            unsubscribe: {
                writable: false,
                value: (eventName, callback) => {
                    if (!p.publishers[eventName]) return;
                    if (!p.publishers[eventName].includes(callback)) return;
                    p.publishers[eventName].splice(p.publishers[eventName].indexOf(callback), 1);
                }
            }
        }
    };

    p.public.styles = {
        writable: false,
        value: p.styles
    };

    Object.defineProperties(p.renderMethods, {
        domQuery: {
            writable : false,
            value : Object.keys(p.renderMethods).join(", ")
        }
    });

    return p;
}

const props = createProperties();

Object.defineProperties(slang, props.public);
})();
