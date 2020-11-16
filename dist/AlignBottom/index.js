"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlignBottom = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
class AlignBottom extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._isRemixing = observable_1.Observable.givenValueOrObservable(this.props.isRemixing);
    }
    get element() {
        return this._element;
    }
    onActivate() {
        switch (this.props.element.type) {
            case "thisElement":
                this._element = this.props.element.element;
                break;
            case "parentElement":
                this._element = this.addActor(web_1.ManagedElement.givenDefinition({
                    tagName: "div",
                    parentElement: this.props.element.parentElement,
                })).element;
                break;
            default:
                throw new Error("An element is required (this or parent)");
        }
        const classNames = observable_1.ObservableSet.ofEmpty();
        this.cancelOnDeactivate(this._isRemixing.didChange.subscribe((isRemixing) => {
            if (isRemixing) {
                classNames.sync(WrapperStyle.toClassNames("isRemixing"));
            }
            else {
                classNames.sync(WrapperStyle.toClassNames());
            }
        }, true));
        this.cancelOnDeactivate(classNames.didChangeSteps.subscribe((steps) => {
            steps.forEach((step) => {
                switch (step.type) {
                    case "add":
                        this._element.classList.add(step.value);
                        break;
                    case "remove":
                        this._element.classList.remove(step.value);
                        break;
                }
            });
        }, true));
    }
}
exports.AlignBottom = AlignBottom;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    css: `
    align-items: flex-end;
    bottom: 0;
    display: flex;
    justify-content: stretch;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s ease bottom;
  `,
    modifiers: {
        isRemixing: `
      bottom: 60px;
    `,
    },
});
//# sourceMappingURL=index.js.map