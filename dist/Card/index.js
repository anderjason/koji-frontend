"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
class Card extends skytree_1.Actor {
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
        this._element.classList.add(WrapperStyle.toCombinedClassName());
    }
}
exports.Card = Card;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    css: `
    background: #FFFFFF;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    padding: 24px 20px 16px 20px;
  `,
});
//# sourceMappingURL=index.js.map