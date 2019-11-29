class Sticky {
    constructor (el, className = 'is-sticky') {
        if (!(el instanceof HTMLElement)) {
            console.error('[Sticky] Invalid sticky implementation. Must pass element as first argument.');
            return;
        }

        this.$el = el;
        this.$className = className;
        this.$rootElement = document.documentElement;
        this.$top = 0;

        document.onscroll = () => this.position().check();
        this.position().check();
    }

    check () {
        if (this.$rootElement.scrollTop > this.$top) {
            this.$el.classList.add(this.$className);
        } else {
            this.$el.classList.remove(this.$className);
        }

        return this;
    }

    position () {
        if (this.$el.classList.contains(this.$className)) {
            return this;
        }

        let newDocStart = this.$rootElement.scrollTop,
            newClientRel = this.$el.getBoundingClientRect(),
            newClientTop = newClientRel.y || newClientRel.top,
            newTop = newClientTop + newDocStart - 15;

        newTop = newTop < 0 ? 0 : newTop;

        if (this.$top === newTop) {
            return this;
        }

        this.$top = newTop;
        return this;
    }

}


export default function (...args) {
    return new Sticky(...args);
}
