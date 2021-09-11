class ScrollSpy {
    /**
     * ScrollSpy class is intended to observe an element and run actions when the element
     * meets the criterion of the position.
     *
     * @param {HTMLElement} el
     * @param {number} delay
     */
    constructor (el, delay = 100) {
        if (! (el instanceof HTMLElement)) {
            throw new Error('Invalid sticky implementation. Must pass element as first argument.');
        }

        if(! Number.isInteger(delay)) {
            throw new Error('The delay on the scroll spy must be an integer.');
        }

        this.$el = el;
        this.$actions = { above: [], on: [], below: [], inView: [], notInView: [] };

        let deferrer = null;

        window.setTimeout(() => {
            this.update();

            window.setTimeout(() => {
                window.addEventListener('scroll', () => {
                    window.clearTimeout(deferrer);

                    deferrer = window.setTimeout(() => this.update(), delay);
                }, {
                    capture: false,
                    passive: true
                });
            }, 1);
        }, 1);
    }

    /**
     * Checks the position of the element and runs the actions that meet the
     * necessary criteria.
     *
     * @returns {ScrollSpy}
     */
    update () {
        let documentEl = document.documentElement,
            newDocStart = documentEl.scrollTop,
            newClientRel = this.$el.getBoundingClientRect(),
            newClientTop = newClientRel.y || newClientRel.top,
            newTop = newClientTop + newDocStart;

        newTop =  Math.round(newTop < 0 ? 0 : newTop);

        if(documentEl.scrollTop === newTop) {
            this.runActions('on');
        } else if(documentEl.scrollTop > newTop) {
            this.runActions('below');
        } else {
            this.runActions('above');
        }

        if(
            newClientRel.top >= 0 &&
            newClientRel.left >= 0 &&
            newClientRel.bottom <= (window.innerHeight || documentEl.clientHeight) &&
            newClientRel.right <= (window.innerWidth || documentEl.clientWidth)
        ) {
            this.runActions('inView');
        } else {
            this.runActions('notInView');
        }

        return this;
    }

    /**
     * Adds an action of the provided type.
     *
     * @param {string} which
     * @param {function} fn
     */
    addAction (which, fn) {
        if(!  this.$actions[which]) {
            throw new Error('The action provided is not available.');
        }

        if(typeof fn !== 'function') {
            throw new Error('Cannot add action that is not a function.');
        }

        this.$actions[which].push(fn);

        return this;
    }

    /**
     * Runs the actions of the provided type.
     *
     * @param {string} which
     */
    runActions(which) {
        if(! this.$actions[which]) {
            throw new Error('Cannot run actions which are not supported.');
        }

        for(let fn of this.$actions[which]) {
            window.setTimeout(fn.bind(this.$el), 0);
        }
    }

    /**
     * Add an action for when the top of the element is above the top of
     * the screen.
     *
     * @param {function} fn
     * @returns {ScrollSpy}
     */
    whenAbove(fn) {
        return this.addAction('above', fn);
    }

    /**
     * Add an action for when the top of the element is now below the top
     * of the screen.
     *
     * @param {function} fn
     * @returns {ScrollSpy}
     */
    whenBelow(fn) {
        return this.addAction('below', fn);
    }

    /**
     * Add an action for when top of the screen is exactly on the element.
     *
     * @param {function} fn
     * @returns {ScrollSpy}
     */
    whenOn(fn) {
        return this.addAction('on', fn);
    }

    /**
     * Add an action for when the element is in view.
     *
     * @param {function} fn
     * @returns {ScrollSpy}
     */
    whenInView(fn) {
        return this.addAction('inView', fn);
    }

    /**
     * Add an action for when the element is not in view.
     *
     * @param {function} fn
     * @returns {ScrollSpy}
     */
    whenNotInView(fn) {
        return this.addAction('notInView', fn);
    }
}

// --
export default ScrollSpy;
