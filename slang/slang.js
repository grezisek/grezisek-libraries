const slang = (
    slangMarkup = "",
    templatesString = "",
    outputContainer

) => slang.translator(slangMarkup, templatesString, outputContainer);

(()=> {
function handleClassName(retNode, className) {
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

function createTemplateCollection(templatesMarkup) {
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

function markupTranslator(slangMarkup, templatesMarkup, outputContainer) {
    if (!slangMarkup.length) return;

    const templates = createTemplateCollection(templatesMarkup);

    if (outputContainer) {
        while (outputContainer.lastChild) outputContainer.lastChild.remove();

        const root = props.renderer(outputContainer, slangMarkup, templates);
        root.querySelectorAll("script").forEach(script => {
            script.parentNode.insertBefore(
                document.createElement("script").appendChild(document.createTextNode(script.innerHTML)).parentNode,
                script
            );
            script.remove();
        });

        outputContainer.prepend(...root.childNodes);
    } else return props.renderer(document.createElement("div"), slangMarkup, templates);
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
    
                const customTemplate = templates[node.attributes[0].name].cloneNode(true);
                
                customTemplate.querySelectorAll("slot")
                    .forEach(slot => slot.outerHTML = 
                        (src => src ? src.innerHTML : slot.outerHTML)
                            ( slot.attributes.length ? node.content.querySelector(slot.attributes[0].name) : null)
                    );
                    
                node.outerHTML = customTemplate.innerHTML;
            },
            struct({node}) {
                let retNode;
        
                if (node.attributes[1]) retNode = document.createElement(node.attributes[1].name);
                else retNode = document.createElement("div");
        
                retNode.prepend(...node.childNodes);
                handleClassName(retNode, node.attributes.length ? node.attributes[0].name.replace("?","_or_").replace("!","_and_") : "col");
                node.outerHTML = retNode.outerHTML;
            }
        },
        styles: {
            node: document.head.appendChild(document.createElement("style")),
            classList: document.createElement("null-node").classList
        },
        getMediaRule(part, isAnd, isOr) {
            if (isAnd) part = part.split("_and_");
            if (isOr) part = part.split("_or_");
            return part.map(rule => {
                if (!rule.includes("h")) return `(min-width: ${parseInt(rule)}px)`
                else return `(min-height: ${parseInt(rule)}px)`
            }).join(isAnd ? " and " : isOr ? ", " : "" );
        },
        renderer(tempRoot, slangMarkup, templates) {
            const root = tempRoot.cloneNode();
            root.innerHTML = slangMarkup;
    
            let queue = root.querySelectorAll(p.renderMethods.domQuery);
            while (queue.length) {
                queue.forEach(node => p.renderMethods[node.localName]({node, templates}));
                queue = root.querySelectorAll(p.renderMethods.domQuery);
            }
    
            return root;
        },
        public: {
            translator: {
                writable: false,
                value: markupTranslator
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
