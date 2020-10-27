import { Actor } from "skytree";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { ThisOrParentElement } from "..";

export interface CardProps {
  element: ThisOrParentElement<HTMLDivElement>;
}

export class Card extends Actor<CardProps> {
  private _element: HTMLDivElement;

  get element(): HTMLElement {
    return this._element;
  }

  onActivate() {
    switch (this.props.element.type) {
      case "thisElement":
        this._element = this.props.element.element;
        break;
      case "parentElement":
        this._element = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this.props.element.parentElement,
          })
        ).element;
        break;
      default:
        throw new Error("An element is required (this or parent)");
    }

    this._element.classList.add(WrapperStyle.toCombinedClassName());
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    background: #FFFFFF;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    padding: 24px 20px 16px 20px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
  `,
});
