import { Color } from "@anderjason/color";
import { Observable, TypedEvent } from "@anderjason/observable";
import { NumberUtil } from "@anderjason/util";
import {
  DynamicStyleElement,
  ElementStyle,
  TextInputBinding,
} from "@anderjason/web";
import { Actor } from "skytree";
import { DisplayTextType } from "../DisplayText";

export interface EditableTextProps {
  parentElement: HTMLElement;
  displayType: DisplayTextType;
  placeholderLabel: string;

  output?: Observable<string>;
  color?: Color | Observable<Color>;
}

export class EditableText extends Actor<EditableTextProps> {
  readonly didFocus = new TypedEvent();
  readonly output: Observable<string>;

  constructor(props: EditableTextProps) {
    super(props);

    this.output =
      this.props.output || Observable.ofEmpty<string>(Observable.isStrictEqual);
  }

  onActivate() {
    const style = styleByDisplayType.get(this.props.displayType);
    const observableColor = Observable.givenValueOrObservable(this.props.color);

    let input:
      | DynamicStyleElement<HTMLInputElement>
      | DynamicStyleElement<HTMLTextAreaElement>;

    switch (this.props.displayType) {
      case "title":
        input = this.addActor(
          style.toManagedElement({
            tagName: "textarea",
            parentElement: this.props.parentElement,
          })
        );
        break;
      case "description":
        input = this.addActor(
          style.toManagedElement({
            tagName: "textarea",
            parentElement: this.props.parentElement,
          })
        );
        break;
      default:
        throw new Error(`Unsupported display type '${this.props.displayType}`);
    }

    input.element.classList.add("kft-control");
    input.element.placeholder = this.props.placeholderLabel;

    this.cancelOnDeactivate(
      input.addManagedEventListener("focus", () => {
        input.element.setSelectionRange(0, (input.element.value || "").length);
        this.didFocus.emit();
      })
    );

    this.addActor(
      new TextInputBinding({
        inputElement: input.element,
        value: this.output,
        displayTextGivenValue: (v) => v,
        valueGivenDisplayText: (v) => v,
      })
    );

    this.cancelOnDeactivate(
      this.output.didChange.subscribe(() => {
        input.style.height = "25px";

        const height = NumberUtil.numberWithHardLimit(
          input.element.scrollHeight,
          25,
          100
        );
        input.style.height = `${height}px`;
      }, true)
    );

    this.cancelOnDeactivate(
      observableColor.didChange.subscribe((color) => {
        if (color == null) {
          return;
        }

        input.style.color = color.toHexString();
      }, true)
    );
  }
}

const TitleStyle = ElementStyle.givenDefinition({
  css: `
    appearance: none;
    border: none;
    font-family: PT Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 34px;
    letter-spacing: 0.02em;
    outline: none;
    resize: none;
    padding: 0;
    margin: 0;
    user-select: auto;
    width: 100%;

    &::placeholder {
      color: #BDBDBD;
    }
  `,
});

const DescriptionStyle = ElementStyle.givenDefinition({
  css: `
    appearance: none;
    border: none;
    color: #2D2F30;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
    height: 25px;
    padding: 0;
    outline: none;
    overflow: auto;
    resize: none;
    user-select: auto;
    -webkit-user-select: auto;
    width: 100%;

    &::placeholder {
      color: #BDBDBD;
    }
  `,
});

const styleByDisplayType = new Map<DisplayTextType, ElementStyle>();
styleByDisplayType.set("title", TitleStyle);
styleByDisplayType.set("description", DescriptionStyle);
