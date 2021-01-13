"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItem = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const TextAccessory_1 = require("./TextAccessory");
const ToggleAccessory_1 = require("./ToggleAccessory");
class LineItem extends skytree_1.Actor {
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        const label = this.addActor(LabelStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
            innerHTML: this.props.label,
        }));
        const { accessoryData } = this.props;
        switch (accessoryData.type) {
            case "text":
                this.addActor(new TextAccessory_1.TextAccessory({
                    parentElement: wrapper.element,
                    label: accessoryData.text,
                }));
                this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
                    accessoryData.onClick();
                }));
                break;
            case "toggle":
                this.addActor(new ToggleAccessory_1.ToggleAccessory({
                    parentElement: wrapper.element,
                    isActive: accessoryData.isActive,
                }));
                this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
                    accessoryData.isActive.setValue(!accessoryData.isActive.value);
                }));
                break;
            default:
                break;
        }
    }
}
exports.LineItem = LineItem;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr auto;
    min-height: 36px;
    margin-bottom: 2px;
    width: 100%;
    align-items: center;
  `,
});
const LabelStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "LineItemLabel",
    css: `
    color: rgb(45, 47, 48);
    font-family: Source Sans Pro;
    font-size: 17px;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 0.02em;
    line-height: 18px;
    user-select: none;
  `,
});
//# sourceMappingURL=LineItem.js.map