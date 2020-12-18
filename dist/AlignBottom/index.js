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
        this._isFullHeight = observable_1.Observable.givenValueOrObservable(this.props.isFullHeight || false);
    }
    get element() {
        return this._wrapper.element;
    }
    onActivate() {
        switch (this.props.target.type) {
            case "thisElement":
                this._parentElement = this.props.target.element;
                break;
            case "parentElement":
                this._parentElement = this.addActor(web_1.ManagedElement.givenDefinition({
                    tagName: "div",
                    parentElement: this.props.target.parentElement,
                })).element;
                break;
            default:
                throw new Error("An element is required (this or parent)");
        }
        this._wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this._parentElement,
        }));
        this.cancelOnDeactivate(this._isFullHeight.didChange.subscribe((isFullHeight) => {
            this._wrapper.setModifier("isFullHeight", isFullHeight);
        }, true));
        this.cancelOnDeactivate(this._isRemixing.didChange.subscribe((isRemixing) => {
            this._wrapper.setModifier("isRemixing", isRemixing);
        }, true));
    }
}
exports.AlignBottom = AlignBottom;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    align-items: stretch;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    left: 0;
    transition: 0.3s ease all;
    position: absolute;
    right: 0;
    max-height: 100%;
  `,
    modifiers: {
        isFullHeight: `
      height: 100%;
    `,
        isRemixing: `
      margin-bottom: 60px;
      max-height: calc(100% - 60px);
    `,
    },
});
//# sourceMappingURL=index.js.map