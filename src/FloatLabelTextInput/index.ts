import { Observable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import { ElementStyle, TextInputBinding } from "@anderjason/web";
import { TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
import { KojiTypography } from "../KojiTypography";

export interface FloatLabelTextInputProps<T> {
  displayTextGivenValue: (value: T) => string;
  overrideDisplayText?: (e: TextInputChangingData<T>) => string;
  parentElement: HTMLElement;
  value: Observable<T>;
  valueGivenDisplayText: (displayText: string) => T;

  persistentLabel?: string;
  placeholder?: string;
}

export class FloatLabelTextInput<T> extends Actor<FloatLabelTextInputProps<T>> {
  constructor(props: FloatLabelTextInputProps<T>) {
    super(props);

    KojiTypography.preloadFonts();
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    const input = this.addActor(
      InputStyle.toManagedElement({
        tagName: "input",
        parentElement: wrapper.element,
      })
    );
    input.element.type = "text";
    input.element.placeholder = this.props.placeholder;

    this.cancelOnDeactivate(
      wrapper.addManagedEventListener("click", () => {
        input.element.focus();
      })
    );

    this.cancelOnDeactivate(
      input.addManagedEventListener("focus", () => {
        input.element.setSelectionRange(0, (input.element.value || "").length);
      })
    );

    const inputBinding = this.addActor(
      new TextInputBinding<T>({
        inputElement: input.element,
        value: this.props.value,
        displayTextGivenValue: this.props.displayTextGivenValue,
        valueGivenDisplayText: this.props.valueGivenDisplayText,
        overrideDisplayText: this.props.overrideDisplayText,
      })
    );

    if (!StringUtil.stringIsEmpty(this.props.persistentLabel)) {
      const label = this.addActor(
        LabelStyle.toManagedElement({
          tagName: "label",
          parentElement: wrapper.element,
        })
      );
      label.element.innerHTML = this.props.persistentLabel;

      this.cancelOnDeactivate(
        inputBinding.isEmpty.didChange.subscribe((isEmpty) => {
          input.setModifier("hasValue", !isEmpty);
          label.setModifier("hasValue", !isEmpty);
        }, true)
      );
    }
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    align-items: center;
    background: white;
    border: 1px solid #E0E0E0;
    border-radius: 10px;
    display: flex;
    line-height: 25px;
    letter-spacing: 0.02em;
    height: 50px;
    outline: none;
    margin-left: -4px;
    margin-right: -4px;
    pointer-events: auto;
    position: relative;
    user-select: auto;
    width: 100%;
    transition: 0.2s ease border-color;

    &:focus-within {
      border-color: #007AFF;

      label {
        color: #007AFF;
      }
    }
  `,
});

const LabelStyle = ElementStyle.givenDefinition({
  css: `
    color: #BDBDBD;
    position: absolute;
    left: 12px;
    top: 5px;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
    transition: 0.2s ease color, 0.1s ease opacity, 0.1s ease transform;
    transform: translateY(8px);
    opacity: 0;
  `,
  modifiers: {
    hasValue: `
      transform: translateY(0);
      opacity: 1;
    `,
  },
});

const InputStyle = ElementStyle.givenDefinition({
  css: `
    appearance: none;
    background: transparent;
    border: none;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
    margin-left: 12px;
    margin-right: 3px;
    outline: none;
    user-select: auto;
    padding: 0;
    width: 100%;
    -webkit-user-select: auto;
    transition: 0.1s ease-out transform;

    &::placeholder {
      color: #BDBDBD;
    }
  `,
  modifiers: {
    hasValue: `
      transform: translateY(8px);
    `,
  },
});
