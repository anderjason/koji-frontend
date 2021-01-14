import { Actor } from "skytree";
import { ElementStyle } from "@anderjason/web";
import { DetailAccessory } from "./DetailAccessory";
import { ToggleAccessory } from "./ToggleAccessory";
import { RadioAccessory } from "./RadioAccessory";
import { OptionDefinition } from "..";

export interface LineItemProps {
  parentElement: HTMLElement;
  optionDefinition: OptionDefinition;
}

export class LineItem extends Actor<LineItemProps> {
  onActivate() {
    const { optionDefinition } = this.props;

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
        this.addActor(new DetailAccessory({
          parentElement: wrapper.element,
          text: optionDefinition.text,
        }));

        this.cancelOnDeactivate(
          wrapper.addManagedEventListener("click", () => {
            optionDefinition.onClick();
          })
        );
        break;
      case "toggle":
        const toggleAccessory = this.addActor(new ToggleAccessory({
          parentElement: wrapper.element,
          defaultValue: optionDefinition.defaultValue,
          onChange: optionDefinition.onChange
        }));

        this.cancelOnDeactivate(
          wrapper.addManagedEventListener("click", () => {
            toggleAccessory.forceToggleValue();
          })
        );
        break;
      case "radio":
        this.addActor(new RadioAccessory({
            parentElement: wrapper.element,
            key: optionDefinition.key,
            selectedKey: optionDefinition.selectedKey
          }));
  
          this.cancelOnDeactivate(
            wrapper.addManagedEventListener("click", () => {
              optionDefinition.selectedKey.setValue(optionDefinition.key);
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
});

const LabelStyle = ElementStyle.givenDefinition({
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
