/**
 * ScrollSpy class is intended to observe an element and inform on if the scroll is above, below,
 * or right on it.
 */
class ScrollSpy {
    constructor (el, delay = 100) {
        if (!(el instanceof HTMLElement)) {
            throw new Error('Invalid sticky implementation. Must pass element as first argument.');
        }

        this.$el = el;
        this.$actions = { above: [], on: [], below: []};
        this.$availableActions = Object.keys(this.$actions);

        this.$deferer = null;
        this.$rootElement = document.documentElement;

        this.$top = 0;
        this.$above = false;
        this.$below = false;
        this.$on = false;

        document.onscroll = () => {
            if(this.$deferer) {
                window.clearTimeout(this.$deferer);
            }

            this.$deferer = window.setTimeout(() => this.position().check(), delay);
        };

        this.position().check();
    }

    set on (newValue) {
        this.$on = newValue;

        if(newValue) {
            this.runActions('on');
        }
    }

    set below (newValue) {
        this.$below = newValue;

        if(newValue) {
            this.runActions('below');
        }
    }

    set above (newValue) {
        this.$above = newValue;

        if(newValue) {
            this.runActions('above');
        }
    }

    check () {
        this.on = this.$rootElement === this.$top;
        this.below = this.$rootElement.scrollTop > this.$top;
        this.above = ! this.$on && ! this.$below;

        return this;
    }

    position () {
        let newDocStart = this.$rootElement.scrollTop,
            newClientRel = this.$el.getBoundingClientRect(),
            newClientTop = newClientRel.y || newClientRel.top,
            newTop = newClientTop + newDocStart;

        newTop = newTop < 0 ? 0 : newTop;

        if (this.$top === newTop) {
            return this;
        }

        this.$top = newTop;

        return this;
    }

    /**
     *
     * @param when
     * @param fn
     * @param immediate
     */
    addAction (when, fn, immediate = false) {
        if(!  this.$availableActions.includes(when)) {
            throw new Error('Actions can only be added above, below, or on.');
        }

        if(typeof fn !== 'function') {
            throw new Error('Cannot add action that is not a function.');
        }

        this.$actions[when].push(fn);

        if(immediate && this['$' + when]) {
            fn(this.$el);
        }
    }

    /**
     *
     * @param which
     */
    runActions(which) {
        if(!  this.$availableActions.includes(which)) {
            throw new Error('Cannot run actions which are not supported.');
        }

        for(let fn of this.$actions[which]) {
            fn(this.$el);
        }
    }
}

// --
export default ScrollSpy;
