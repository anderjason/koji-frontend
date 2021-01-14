"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItem = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const DetailAccessory_1 = require("./DetailAccessory");
const ToggleAccessory_1 = require("./ToggleAccessory");
const RadioAccessory_1 = require("./RadioAccessory");
class LineItem extends skytree_1.Actor {
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        this.addActor(LabelStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
            innerHTML: this.props.label,
        }));
        const { accessoryData } = this.props;
        switch (accessoryData.type) {
            case "detail":
                this.addActor(new DetailAccessory_1.DetailAccessory({
                    parentElement: wrapper.element,
                    text: accessoryData.text,
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
            case "radio":
                this.addActor(new RadioAccessory_1.RadioAccessory({
                    parentElement: wrapper.element,
                    key: accessoryData.key,
                    selectedKey: accessoryData.selectedKey
                }));
                this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
                    accessoryData.selectedKey.setValue(accessoryData.key);
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
    align-items: center;
    border-bottom: 1px solid rgb(236, 236, 236);
    box-sizing: border-box;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr auto;
    min-height: 42px;
    padding-right: 20px;
    text-align: left;
    width: 100%;

    &:last-child {
      border-bottom: none;
    }
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