import { Observable, ObservableBase } from "@anderjason/observable";
import {
  DynamicStyleElement,
  ElementStyle,
  ManagedElement,
} from "@anderjason/web";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";

export interface AlignBottomProps {
  target: ThisOrParentElement<HTMLDivElement>;
  isRemixing: boolean | ObservableBase<boolean>;
  
  isFullHeight?: boolean | ObservableBase<boolean>;
}

export class AlignBottom extends Actor<AlignBottomProps> {
  private _parentElement: HTMLElement;
  private _wrapper: DynamicStyleElement<HTMLDivElement>;
  private _isRemixing: ObservableBase<boolean>;
  private _isFullHeight: ObservableBase<boolean>;

  constructor(props: AlignBottomProps) {
    super(props);

    this._isRemixing = Observable.givenValueOrObservable(this.props.isRemixing);
    this._isFullHeight = Observable.givenValueOrObservable(this.props.isFullHeight || false);
  }

  get element(): HTMLElement {
    return this._wrapper.element;
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

    this._wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this._parentElement,
      })
    );

    this.cancelOnDeactivate(
      this._isFullHeight.didChange.subscribe((isFullHeight) => {
        this._wrapper.setModifier("isFullHeight", isFullHeight);
      }, true)
    );

    this.cancelOnDeactivate(
      this._isRemixing.didChange.subscribe((isRemixing) => {
        this._wrapper.setModifier("isRemixing", isRemixing);
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    align-items: stretch;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    left: 0;
    transition: 0.3s ease all;
    position: absolute;
    right: 0;
    max-height: 100%;
  `,
  modifiers: {
    isFullHeight: `
      height: 100%;
    `,
    isRemixing: `
      margin-bottom: 60px;
      max-height: calc(100% - 60px);
    `,
  },
});
