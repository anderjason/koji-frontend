"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioAccessory = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const checkSvg = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"></path></svg>`;
class RadioAccessory extends skytree_1.Actor {
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
            innerHTML: checkSvg
        }));
        this.cancelOnDeactivate(this.props.selectedKey.didChange.subscribe(selectedKey => {
            wrapper.setModifier("isVisible", selectedKey === this.props.key);
        }, true));
    }
}
exports.RadioAccessory = RadioAccessory;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    opacity: 0;
    user-select: none;
    transition: 0.15s ease opacity;

    svg {
      color: #007AFF;
      margin-top: 4px;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
  `,
    modifiers: {
        isVisible: `
      opacity: 1;
    `
    }
});
//# sourceMappingURL=RadioAccessory.js.map