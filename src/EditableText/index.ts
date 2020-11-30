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

    input.element.classList.add("kft-text");
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
    -webkit-user-select: auto;
    appearance: none;
    background: none;
    border: none;
    font-family: PT Sans;
    font-size: 26px;
    font-style: normal;
    font-weight: bold;
    letter-spacing: 0.02em;
    line-height: 34px;
    margin-top: -6px;
    outline: none;
    padding: 0;
    resize: none;
    user-select: auto;
    width: 100%;

    &::placeholder {
      color: #BDBDBD;
    }
  `,
});

const DescriptionStyle = ElementStyle.givenDefinition({
  css: `
    -webkit-user-select: auto;
    appearance: none;
    border: none;
    color: #2D2F30;
    font-family: Source Sans Pro;
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    height: 25px;
    letter-spacing: 0.02em;
    line-height: 25px;
    margin-top: -3px;
    outline: none;
    overflow: auto;
    padding: 0;
    resize: none;
    user-select: auto;
    width: 100%;

    &::placeholder {
      color: #BDBDBD;
    }
  `,
});

const styleByDisplayType = new Map<DisplayTextType, ElementStyle>();
styleByDisplayType.set("title", TitleStyle);
styleByDisplayType.set("description", DescriptionStyle);
