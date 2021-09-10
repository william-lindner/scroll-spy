let availableActions = null;

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
        this.$actions = { above: [], on: [], below: [] };
        this.$rootElement = document.documentElement;

        this.$delay = delay;
        this.$deferrer = null;

        availableActions = availableActions || Object.keys(this.$actions);

        document.onscroll = () => this.check();
    }

    setDelay(amount) {
        if(Number.isInteger(amount)) {
            throw new Error('The delay on the scroll spy must be an integer.');
        }

        this.$delay = amount;

        return this.check();
    }

    check () {
        window.clearTimeout(this.$deferrer)

        this.$deferrer = window.setTimeout(() => this.update(), this.$delay);

        return this;
    }

    update (position) {
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
     */
    addAction (when, fn) {
        if(!  availableActions.includes(when)) {
            throw new Error('Actions can only be added above, below, or on.');
        }

        if(typeof fn !== 'function') {
            throw new Error('Cannot add action that is not a function.');
        }

        this.$actions[when].push(fn);

        return this.check();
    }

    /**
     *
     * @param which
     */
    runActions(which) {
        if(! availableActions.includes(which)) {
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
