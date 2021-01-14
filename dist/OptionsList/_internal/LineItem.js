"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItem = void 0;
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const DetailAccessory_1 = require("./DetailAccessory");
const RadioAccessory_1 = require("./RadioAccessory");
const ToggleAccessory_1 = require("./ToggleAccessory");
class LineItem extends skytree_1.Actor {
    onActivate() {
        const { optionDefinition, valuesByPropertyName } = this.props;
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        this.addActor(LabelStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
            innerHTML: optionDefinition.label,
        }));
        switch (optionDefinition.type) {
            case "detail":
                this.addActor(new DetailAccessory_1.DetailAccessory({
                    parentElement: wrapper.element,
                    summaryText: optionDefinition.summaryText,
                }));
                this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
                    optionDefinition.onClick();
                }));
                break;
            case "toggle":
                const toggleAccessory = this.addActor(new ToggleAccessory_1.ToggleAccessory({
                    parentElement: wrapper.element,
                    propertyName: optionDefinition.propertyName,
                    valuesByPropertyName
                }));
                this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
                    const isToggleActive = valuesByPropertyName.toOptionalValueGivenKey(optionDefinition.propertyName) == true;
                    valuesByPropertyName.setValue(optionDefinition.propertyName, !isToggleActive);
                }));
                break;
            case "radio":
                this.addActor(new RadioAccessory_1.RadioAccessory({
                    parentElement: wrapper.element,
                    propertyName: optionDefinition.propertyName,
                    propertyValue: optionDefinition.propertyValue,
                    valuesByPropertyName
                }));
                this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
                    valuesByPropertyName.setValue(optionDefinition.propertyName, optionDefinition.propertyValue);
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