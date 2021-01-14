import { Actor } from "skytree";
import { ElementStyle } from "@anderjason/web";
import { Observable, ObservableBase } from "@anderjason/observable";
import { DetailAccessory } from "./DetailAccessory";
import { ToggleAccessory } from "./ToggleAccessory";
import { RadioAccessory } from "./RadioAccessory";

export interface DetailAccessoryData {
  type: "detail";
  onClick: () => void;

  text?: ObservableBase<string>;
}

export interface ToggleAccessoryData {
  type: "toggle";
  isActive: Observable<boolean>;
}

export interface RadioAccessoryData {
  type: "radio";
  key: string;
  selectedKey: Observable<string>;
}

export type LineItemAccessoryData = DetailAccessoryData | ToggleAccessoryData | RadioAccessoryData;

export interface LineItemProps {
  parentElement: HTMLElement;
  label: string;
  accessoryData: LineItemAccessoryData;
}

export class LineItem extends Actor<LineItemProps> {
  onActivate() {
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
        innerHTML: this.props.label,
      })
    );

    const { accessoryData } = this.props;
    
    switch (accessoryData.type) {
      case "detail":
        this.addActor(new DetailAccessory({
          parentElement: wrapper.element,
          text: accessoryData.text,
        }));

        this.cancelOnDeactivate(
          wrapper.addManagedEventListener("click", () => {
            accessoryData.onClick();
          })
        );
        break;
      case "toggle":
        this.addActor(new ToggleAccessory({
          parentElement: wrapper.element,
          isActive: accessoryData.isActive,
        }));

        this.cancelOnDeactivate(
          wrapper.addManagedEventListener("click", () => {
            accessoryData.isActive.setValue(!accessoryData.isActive.value);
          })
        );
        break;
      case "radio":
        this.addActor(new RadioAccessory({
            parentElement: wrapper.element,
            key: accessoryData.key,
            selectedKey: accessoryData.selectedKey
          }));
  
          this.cancelOnDeactivate(
            wrapper.addManagedEventListener("click", () => {
              accessoryData.selectedKey.setValue(accessoryData.key);
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
