import { Actor } from "skytree";
import { ElementStyle } from "@anderjason/web";
import { Observable, ObservableBase } from "@anderjason/observable";
import { TextAccessory } from "./TextAccessory";
import { ToggleAccessory } from "./ToggleAccessory";

export interface TextAccessoryData {
  type: "text";
  text: ObservableBase<string>;
  onClick: () => void;
}

export interface ToggleAccessoryData {
  type: "toggle";
  isActive: Observable<boolean>;
}

export type LineItemAccessoryData = TextAccessoryData | ToggleAccessoryData;

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

    const label = this.addActor(
      LabelStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
        innerHTML: this.props.label,
      })
    );

    const { accessoryData } = this.props;
    
    switch (accessoryData.type) {
      case "text":
        this.addActor(new TextAccessory({
          parentElement: wrapper.element,
          label: accessoryData.text,
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
      default:
        break;
    }
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
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
