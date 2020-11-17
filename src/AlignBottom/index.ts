import {
  Observable,
  ObservableBase,
  ObservableSet,
} from "@anderjason/observable";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";

export interface AlignBottomProps {
  target: ThisOrParentElement<HTMLDivElement>;
  isRemixing: boolean | ObservableBase<boolean>;
}

export class AlignBottom extends Actor<AlignBottomProps> {
  private _element: HTMLDivElement;
  private _isRemixing: ObservableBase<boolean>;

  constructor(props: AlignBottomProps) {
    super(props);

    this._isRemixing = Observable.givenValueOrObservable(this.props.isRemixing);
  }

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

    const classNames = ObservableSet.ofEmpty<string>();

    this.cancelOnDeactivate(
      this._isRemixing.didChange.subscribe((isRemixing) => {
        if (isRemixing) {
          classNames.sync(WrapperStyle.toClassNames("isRemixing"));
        } else {
          classNames.sync(WrapperStyle.toClassNames());
        }
      }, true)
    );

    this.cancelOnDeactivate(
      classNames.didChangeSteps.subscribe((steps) => {
        steps.forEach((step) => {
          switch (step.type) {
            case "add":
              this._element.classList.add(step.value);
              break;
            case "remove":
              this._element.classList.remove(step.value);
              break;
          }
        });
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    align-items: stretch;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s ease bottom;
  `,
  modifiers: {
    isRemixing: `
      bottom: 60px;
    `,
  },
});
