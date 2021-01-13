"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAccessory = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const arrowSvg = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"></path></svg>`;
class TextAccessory extends skytree_1.Actor {
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement
        }));
        const label = this.addActor(LabelStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        this.cancelOnDeactivate(this.props.label.didChange.subscribe(str => {
            label.element.innerHTML = str || "";
        }, true));
        const svg = document.createElement("svg");
        wrapper.element.appendChild(svg);
        svg.outerHTML = arrowSvg;
    }
}
exports.TextAccessory = TextAccessory;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    align-items: center;
    background: rgb(235, 235, 235);
    border-radius: 5px;
    color: rgb(0, 122, 255);
    display: flex;
    padding: 2px 4px 2px 8px;

    svg {
      display: inline-block;
      user-select: none;
      flex-shrink: 0;
      margin-top: 2px;
      width: 18px;
      height: 18px;
    }
  `
});
const LabelStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Label",
    css: `
    font-family: Source Sans Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 0.02em;
    line-height: 18px;
    user-select: none;
  `
});
//# sourceMappingURL=TextAccessory.js.map