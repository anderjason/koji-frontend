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
        switch (this.props.target.type) {
            case "thisElement":
                this._element = this.props.target.element;
                break;
            case "parentElement":
                this._element = this.addActor(web_1.ManagedElement.givenDefinition({
                    tagName: "div",
                    parentElement: this.props.target.parentElement,
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
    elementDescription: "Wrapper",
    css: `
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    color: #2D2F30;
    margin: 20px;
    padding: 16px 20px 16px 20px;
    width: calc(100% - 40px);
  `,
});
//# sourceMappingURL=index.js.map