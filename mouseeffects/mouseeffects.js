(()=>{
    if (window["MouseEffects"]) 
        return console.error("MouseEffects: disabled - global namespace 'MouseEffects' is already in use.");
    if ('ontouchstart' in document.documentElement) 
        return console.warn("MouseEffects: disabled - touch device detected.");

    const _mouseEffects = [];
    
    _mouseEffects.Subscribe = subscriber => !_mouseEffects.includes(subscriber) && _mouseEffects.push(subscriber);
    _mouseEffects.Unsubscribe = subscriber => (i => (i > -1) && _mouseEffects.splice(i, 1))(_mouseEffects.indexOf(subscriber));

    _mouseEffects.Start = (selector = ".has-mouse-effects") => {
        document.querySelectorAll(selector ?? ".has-mouse-effects").forEach(_mouseEffects.Subscribe);
        addEventListener("mousemove", _update, { passive: true });
    };

    _mouseEffects.Stop = () => {
        _mouseEffects.forEach(subscriber => _mouseEffects.Unsubscribe(subscriber) && subscriber.classList.remove("mouse-effects-set"));
        removeEventListener("mousemove", _update);
    };
    
    const _updateSubscriber = (subscriber, mouseMoveEvent) => {
        const top = mouseMoveEvent.pageY - subscriber.offsetTop;
        const left = mouseMoveEvent.pageX - subscriber.offsetLeft;
        subscriber.style.setProperty('--cursor-top--px', `${top}px`);
        subscriber.style.setProperty('--cursor-left--px', `${left}px`);
        subscriber.style.setProperty('--cursor-top--percent', `${top / subscriber.offsetHeight * 100}%`);
        subscriber.style.setProperty('--cursor-left--percent', `${left / subscriber.offsetWidth * 100}%`);

        subscriber.classList.add("mouse-effects-set");
    };

    const _update = mouseMoveEvent => _mouseEffects.forEach(subscriber => _updateSubscriber(subscriber, mouseMoveEvent));
    
    window["MouseEffects"] = _mouseEffects;
})();