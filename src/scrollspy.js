/**
 * ScrollSpy class is intended to observe an element and inform on if the scroll is above, below,
 * or right on it.
 */
class ScrollSpy {
    constructor (el, delay = 200) {
        if (!(el instanceof HTMLElement)) {
            throw new Error('Invalid sticky implementation. Must pass element as first argument.');
        }

        this.$el = el;
        this.$actions = { above: [], on: [], below: []};
        this.$availableActions = Object.keys(this.$actions);
        this.$rootElement = document.documentElement;

        let deferrer;

        document.onscroll = () => {
            window.clearTimeout(deferrer)

            deferrer = window.setTimeout(() => this.check(), delay);
        };

        this.check();
    }

    check (position) {
        if(position == null) {
            position = this.position();
        }

        position = Math.round(position);

        if(this.$rootElement.scrollTop === position) {
            this.runActions('on');
        } else if(this.$rootElement.scrollTop > position) {
            this.runActions('below');
        } else {
            this.runActions('above');
        }

        return this;
    }

    position () {
        let newDocStart = this.$rootElement.scrollTop,
            newClientRel = this.$el.getBoundingClientRect(),
            newClientTop = newClientRel.y || newClientRel.top,
            newTop = newClientTop + newDocStart;

        newTop = newTop < 0 ? 0 : newTop;

        return newTop;
    }

    /**
     *
     * @param when
     * @param fn
     * @param immediate
     */
    addAction (when, fn, immediate = true) {
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

        return this;
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

    whenAbove(fn) {
        return this.addAction('above', fn);
    }

    whenBelow(fn) {
        return this.addAction('below', fn);
    }

    whenOn(fn) {
        return this.addAction('on', fn);
    }
}

// --
export default ScrollSpy;
