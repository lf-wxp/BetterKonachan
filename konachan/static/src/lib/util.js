const Util = {};
Util.whichAnimationEvent = () => {
    const el = document.createElement('fakeelement');
    let animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

Util.whichTransitionEvent = () => {
    const el = document.createElement('fakeelement');
    let transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };
    for (let t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

Util.whichAnimationEventStart = () => {
    const el = document.createElement('fakeelement');
    let animations = {
        'animation': 'animationstart',
        'OAnimation': 'oAnimationStart',
        'MozAnimation': 'animationstart',
        'WebkitAnimation': 'webkitAnimationStart'
    };
    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

Util.whichAnimationEventEnd = () => {
    const el = document.createElement('fakeelement');
    let animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    };
    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}
export
default Util;