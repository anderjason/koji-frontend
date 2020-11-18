import { Actor } from "skytree";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { ThisOrParentElement } from "..";

export interface CardProps {
  target: ThisOrParentElement<HTMLDivElement>;
}

export class Card extends Actor<CardProps> {
  private _element: HTMLDivElement;

  get element(): HTMLElement {
    return this._element;
  }

  onActivate() {
    switch (this.props.target.type) {
      case "thisElement":
        this._element = this.props.target.element;
        break;
      case "parentElement":
        this._element = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this.props.target.parentElement,
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
  elementDescription: "Wrapper",
  css: `
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    color: #2D2F30;
    margin: 20px;
    padding: 18px 20px 18px 20px;
    width: calc(100% - 40px);

    & > .kft-control + .kft-control,
    & > .kft-text + .kft-control {
      margin-top: 16px;
    }
  `,
});
