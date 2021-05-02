const slang = (slangMarkup = "", templateCollection = "", outputContainer) => slang.translator(slangMarkup, templateCollection, outputContainer);

(()=> {

const priv = {
    structDefs: {
        "row": "display:flex;flex-direction:row;",
        "col": "display:flex;flex-direction:column;",
        "wor": "display:flex;flex-direction:row-reverse;",
        "loc": "display:flex;flex-direction:column-reverse;"
    },
    renderMethods: {
        template({node, templateCollection}) {
            if (!node.attributes.length || !templateCollection[node.attributes[0].name]){
                console.error("Template not found: ", node.attributes[0].name);
                node.outerHTML = node.outerHTML.replace(node.localName, `${node.localName}-notfound`);
                return;
            }

            const customTemplate = templateCollection[node.attributes[0].name].cloneNode(true);

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

            const className = node.attributes.length ? node.attributes[0].name.replace("?","_or_").replace("!","_and_") : "col";
            retNode.classList.add("struct", className);
            retNode.prepend(...node.childNodes);
            node.outerHTML = retNode.outerHTML;

            if (!slang.styles.classList.contains(className)) {
                slang.styles.node.innerHTML += className.split("-").reduce((acc, part, i) => {
                    part = part + "";
                    if (!acc) acc = "";
        
                    if (i % 2 == 0) {
                        if (!acc.includes("!mediaQueryHere!")) acc += `.${className}{${priv.structDefs[part]}}`;
                        else acc = acc.replace("!mediaQueryHere!", priv.structDefs[part]);
                    } else acc += ` @media ${priv.getMediaRule(part, part.includes("_and_"), part.includes("_or_"))}{.${className}{!mediaQueryHere!}}`;
        
                    return acc;
                },"");
                slang.styles.classList.add(className);
            };
        }
    },
    getMediaRule: (part, isAnd, isOr) => {
        if (isAnd) part = part.split("_and_");
        if (isOr) part = part.split("_or_");
        return part.map(rule => {
            if (!rule.includes("h")) return `(min-width: ${parseInt(rule)}px)`
            else return `(min-height: ${parseInt(rule)}px)`
        }).join(isAnd ? " and " : isOr ? ", " : "" )                    
    },
    renderer: (tempRoot, slangMarkup, templateCollection) => {
        const root = tempRoot.cloneNode();
        root.innerHTML = slangMarkup;

        let queue = root.querySelectorAll(priv.renderMethods.domQuery);
        while (queue.length) {
            queue.forEach(node => priv.renderMethods[node.localName]({node, templateCollection}));
            queue = root.querySelectorAll(priv.renderMethods.domQuery);
        }

        return root;
    }
}

Object.defineProperties(priv.renderMethods, {
    "domQuery" : {
        writable : false,
        value : Object.keys(priv.renderMethods).join(", ")
    }
});

Object.defineProperties(slang, {
    translator: {
        writable: false,
        value: function(slangMarkup, templateCollection, outputContainer) {
            if (!slangMarkup.length) return;

            if (templateCollection.length) templateCollection = ( tempRoot => {
                tempRoot.innerHTML = templateCollection;
                const templates = {};
                Array.prototype.forEach.call(
                    tempRoot.children,
                    template => templates[template.localName.substring(template.localName.indexOf('-')+1)] = template.cloneNode(true)
                );
                return templates;
            })(document.createElement("div"));
            
            if (outputContainer) {
                while (outputContainer.lastChild) outputContainer.lastChild.remove();
                const root = priv.renderer(outputContainer, slangMarkup, templateCollection);

                root.querySelectorAll("script").forEach(script => {
                    script.parentNode.insertBefore(
                        document.createElement("script").appendChild(document.createTextNode(script.innerHTML)).parentNode,
                        script
                    );
                    script.remove();
                });
                outputContainer.prepend(...root.childNodes);
            } else return priv.renderer(document.createElement("div"), slangMarkup, templateCollection);
        }
    },
    styles: {
        writable: false,
        value: {
            node: document.head.appendChild(document.createElement("style")),
            classList: document.createElement("null-node").classList
        }
    }
});

})();
