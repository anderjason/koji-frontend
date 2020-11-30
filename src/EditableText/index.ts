import { Observable, TypedEvent } from "@anderjason/observable";
import { NumberUtil } from "@anderjason/util";
import {
  DynamicStyleElement,
  ElementStyle,
  TextInputBinding,
} from "@anderjason/web";
import { Actor } from "skytree";
import { DisplayTextType } from "../DisplayText";
import { KojiAppearance, KojiTheme } from "../KojiAppearance";

export interface EditableTextProps {
  parentElement: HTMLElement;
  displayType: DisplayTextType;
  placeholderLabel: string;

  output?: Observable<string>;
  theme?: KojiTheme | Observable<KojiTheme>;
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
    const observableTheme = Observable.givenValueOrObservable(
      this.props.theme || KojiAppearance.themes.get("kojiBlack")
    );

    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-text");

    let input:
      | DynamicStyleElement<HTMLInputElement>
      | DynamicStyleElement<HTMLTextAreaElement>;

    switch (this.props.displayType) {
      case "title":
        input = this.addActor(
          style.toManagedElement({
            tagName: "textarea",
            parentElement: wrapper.element,
          })
        );
        break;
      case "description":
        input = this.addActor(
          style.toManagedElement({
            tagName: "textarea",
            parentElement: wrapper.element,
          })
        );
        break;
      default:
        throw new Error(`Unsupported display type '${this.props.displayType}`);
    }

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
      observableTheme.didChange.subscribe((theme) => {
        if (theme == null) {
          return;
        }

        if (this.props.displayType === "title") {
          theme.applyTextStyle(input.element);
        }
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
  `,
});

const TitleStyle = ElementStyle.givenDefinition({
  css: `
    appearance: none;
    background: none;
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
    margin: 0;
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
