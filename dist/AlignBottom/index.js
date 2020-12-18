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
        return this._content.element;
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
        this._parentElement.className = WrapperStyle.toCombinedClassName();
        this._content = this.addActor(ContentStyle.toManagedElement({
            tagName: "div",
            parentElement: this._parentElement,
        }));
        this.cancelOnDeactivate(this._isRemixing.didChange.subscribe(isRemixing => {
            this._content.setModifier("isRemixing", isRemixing);
        }, true));
    }
}
exports.AlignBottom = AlignBottom;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    css: `
    align-items: stretch;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
  `,
});
const ContentStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Content",
    css: `
    background: transparent;
    transition: 0.3s ease margin-bottom;
    pointer-events: auto;
  `,
    modifiers: {
        isRemixing: `
      margin-bottom: 60px;
    `,
    },
});
//# sourceMappingURL=index.js.map