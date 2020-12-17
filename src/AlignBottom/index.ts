import {
  Observable,
  ObservableBase,
  ObservableSet,
} from "@anderjason/observable";
import { DynamicStyleElement, ElementStyle, ManagedElement } from "@anderjason/web";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";

export interface AlignBottomProps {
  target: ThisOrParentElement<HTMLDivElement>;
  isRemixing: boolean | ObservableBase<boolean>;
}

export class AlignBottom extends Actor<AlignBottomProps> {
  private _parentElement: HTMLElement;
  private _content: DynamicStyleElement<HTMLDivElement>;
  private _isRemixing: ObservableBase<boolean>;

  constructor(props: AlignBottomProps) {
    super(props);

    this._isRemixing = Observable.givenValueOrObservable(this.props.isRemixing);
  }

  get element(): HTMLElement {
    return this._content.element;
  }

  onActivate() {
    switch (this.props.target.type) {
      case "thisElement":
        this._parentElement = this.props.target.element;
        break;
      case "parentElement":
        this._parentElement = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this.props.target.parentElement,
          })
        ).element;
        break;
      default:
        throw new Error("An element is required (this or parent)");
    }

    this._parentElement.className = WrapperStyle.toCombinedClassName();

    this._content = this.addActor(
      ContentStyle.toManagedElement({
        tagName: "div",
        parentElement: this._parentElement,
      })
    );

    this.cancelOnDeactivate(
      this._isRemixing.didChange.subscribe(isRemixing => {
        this._content.setModifier("isRemixing", isRemixing);
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    align-items: stretch;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    left: 20px;
    pointer-events: none;
    position: absolute;
    right: 20px;
    top: 20px;
  `,
});

const ContentStyle = ElementStyle.givenDefinition({
  elementDescription: "Content",
  css: `
    background: transparent;
    transition: 0.3s ease margin-bottom;
    pointer-events: auto;
  `,
  modifiers: {
    isRemixing: `
      margin-bottom: 60px;
    `,
  },
});
