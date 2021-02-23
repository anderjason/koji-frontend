import { ObservableDict } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { OptionDefinition } from "..";
import { DetailAccessory } from "./DetailAccessory";
import { RadioAccessory } from "./RadioAccessory";
import { ToggleAccessory } from "./ToggleAccessory";

export interface LineItemProps {
  parentElement: HTMLElement;
  optionDefinition: OptionDefinition;
  valuesByPropertyName: ObservableDict<any>;
}

export class LineItem extends Actor<LineItemProps> {
  onActivate() {
    const { optionDefinition, valuesByPropertyName } = this.props;

    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    this.addActor(
      LabelStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
        innerHTML: optionDefinition.label,
      })
    );

    switch (optionDefinition.type) {
      case "detail":
        this.addActor(
          new DetailAccessory({
            parentElement: wrapper.element,
            summaryText: optionDefinition.summaryText,
          })
        );

        this.cancelOnDeactivate(
          wrapper.addManagedEventListener("click", () => {
            optionDefinition.onClick();
          })
        );
        break;
      case "toggle":
        const toggleAccessory = this.addActor(
          new ToggleAccessory({
            parentElement: wrapper.element,
            propertyName: optionDefinition.propertyName,
            isDisabled: optionDefinition.isDisabled,
            valuesByPropertyName,
          })
        );

        if (optionDefinition.isDisabled == true) {
          wrapper.setModifier("isDisabled", true);
        } else {
          this.cancelOnDeactivate(
            wrapper.addManagedEventListener("click", () => {
              const isToggleActive =
                valuesByPropertyName.toOptionalValueGivenKey(
                  optionDefinition.propertyName
                ) == true;
              valuesByPropertyName.setValue(
                optionDefinition.propertyName,
                !isToggleActive
              );
            })
          );
        }
        break;
      case "radio":
        this.addActor(
          new RadioAccessory({
            parentElement: wrapper.element,
            propertyName: optionDefinition.propertyName,
            propertyValue: optionDefinition.propertyValue,
            valuesByPropertyName,
          })
        );

        this.cancelOnDeactivate(
          wrapper.addManagedEventListener("click", () => {
            valuesByPropertyName.setValue(
              optionDefinition.propertyName,
              optionDefinition.propertyValue
            );
          })
        );
        break;
      default:
        break;
    }
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
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
  modifiers: {
    isDisabled: `
      cursor: auto;
    `,
  },
});

const LabelStyle = ElementStyle.givenDefinition({
  elementDescription: "LineItemLabel",
  css: `
    color: rgb(45, 47, 48);
    font-family: Source Sans Pro;
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 18px;
    user-select: none;
  `,
});
