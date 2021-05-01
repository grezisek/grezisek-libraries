slang = (() => (slangMarkup = "", templateCollection, outputContainer) => {

    if (!slangMarkup.length || !templateCollection) return;

    templateCollection = ( tempRoot => {
        tempRoot.innerHTML = templateCollection;
        const templates = {};
        Array.prototype.forEach.call(
            tempRoot.children,
            template => templates[template.localName.substring(template.localName.indexOf('-')+1)] = template.cloneNode(true)
        );
        return templates;
    })(document.createElement("div"));

    const renderDefs = {
        template(node) {
            if (!templateCollection[node.attributes[0].name]){
                console.error("Template not found: ", node.attributes[0].name);
                node.outerHTML = node.outerHTML.replace(node.localName, `${node.localName}-notfound`);
                return;
            }

            const customTemplate = templateCollection[node.attributes[0].name].cloneNode(true);

            customTemplate.querySelectorAll("slot")
                .forEach(slot => slot.outerHTML = 
                    (src => src ? src.innerHTML : slot.outerHTML)
                        ( node.content.querySelector(slot.attributes[0].name) )
                );
                
            node.outerHTML = customTemplate.innerHTML;
        }
    }

    const renderDefsKeys = Object.keys(renderDefs).join(", ");

    function renderer(tempRoot) {
        const root = tempRoot.cloneNode();
        root.innerHTML = slangMarkup;
        let queue = root.querySelectorAll(renderDefsKeys);
        while (queue.length) {
            queue.forEach(node => renderDefs[node.localName](node));
            queue = root.querySelectorAll(renderDefsKeys);
        }
        return root;
    }
    if (outputContainer) {
        while (outputContainer.lastChild) outputContainer.lastChild.remove();
        const root = renderer(outputContainer);
        root.querySelectorAll("script").forEach(script => {
            script.parentNode.insertBefore(
                document.createElement("script").appendChild(document.createTextNode(script.innerHTML)).parentNode,
                script
            );
            script.remove();
        });
        outputContainer.prepend(...root.childNodes);
    } else return renderer(document.createElement("div"));
})();
