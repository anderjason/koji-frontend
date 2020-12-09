import { Observable, ReadOnlyObservable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import {
  DynamicStyleElement,
  ElementStyle,
  FocusWatcher,
  TextInputBinding,
} from "@anderjason/web";
import { TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
import { KojiAppearance } from "../KojiAppearance";

export interface FloatLabelTextInputProps<T> {
  displayTextGivenValue: (value: T) => string;
  overrideDisplayText?: (e: TextInputChangingData<T>) => string;
  parentElement: HTMLElement;
  value: Observable<T>;
  valueGivenDisplayText: (displayText: string) => T;
  shadowTextGivenValue?: (value: T) => string;
  applyShadowTextOnBlur?: boolean;

  persistentLabel?: string;
  placeholder?: string;
  inputType?: string;
}

export class FloatLabelTextInput<T> extends Actor<FloatLabelTextInputProps<T>> {
  private _isFocused = Observable.ofEmpty<boolean>(Observable.isStrictEqual);
  readonly isFocused = ReadOnlyObservable.givenObservable(this._isFocused);

  constructor(props: FloatLabelTextInputProps<T>) {
    super(props);

    KojiAppearance.preloadFonts();
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-control");

    let shadowText: DynamicStyleElement<HTMLSpanElement>;
    if (this.props.shadowTextGivenValue != null) {
      shadowText = this.addActor(
        ShadowTextStyle.toManagedElement({
          tagName: "span",
          parentElement: wrapper.element,
        })
      );
    }

    const input = this.addActor(
      InputStyle.toManagedElement({
        tagName: "input",
        parentElement: wrapper.element,
      })
    );
    const inputType = this.props.inputType || "text";
    input.element.type = inputType;

    if (this.props.placeholder != null) {
      input.element.placeholder = this.props.placeholder;
    }

    this.cancelOnDeactivate(
      wrapper.addManagedEventListener("click", () => {
        input.element.focus();
      })
    );

    this.addActor(
      new FocusWatcher({
        element: input.element,
        output: this._isFocused,
      })
    );

    const applyShadowText = () => {
      if (
        this.props.shadowTextGivenValue != null &&
        this.props.applyShadowTextOnBlur == true
      ) {
        const text = this.props.shadowTextGivenValue(this.props.value.value);
        if (text != null) {
          input.element.value = text;
        }
      }
    };

    if (inputType === "text") {
      // setSelectionRange is not supported on number inputs
      this.cancelOnDeactivate(
        this._isFocused.didChange.subscribe((isFocused) => {
          if (isFocused == true) {
            input.element.setSelectionRange(
              0,
              (input.element.value || "").length
            );
          } else {
            applyShadowText();
          }
        })
      );
    }

    const inputBinding = this.addActor(
      new TextInputBinding<T>({
        inputElement: input.element,
        value: this.props.value,
        displayTextGivenValue: this.props.displayTextGivenValue,
        valueGivenDisplayText: this.props.valueGivenDisplayText,
        overrideDisplayText: this.props.overrideDisplayText,
      })
    );

    if (shadowText != null && this.props.shadowTextGivenValue != null) {
      this.cancelOnDeactivate(
        this.props.value.didChange.subscribe(() => {
          const text = this.props.shadowTextGivenValue(this.props.value.value);
          if (text == null) {
            shadowText.element.innerHTML = "";
          } else {
            shadowText.element.innerHTML = text;
          }
        }, true)
      );
    }

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

          if (shadowText != null) {
            shadowText.setModifier("hasValue", !isEmpty);
          }
        }, true)
      );
    }

    applyShadowText();
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    align-items: center;
    background: white;
    border: 1px solid #E0E0E0;
    border-radius: 10px;
    box-sizing: border-box;
    display: flex;
    line-height: 25px;
    letter-spacing: 0.02em;
    height: 50px;
    margin-left: -2px;
    margin-right: -2px;
    outline: none;
    pointer-events: auto;
    position: relative;
    user-select: auto;
    width: calc(100% + 4px);
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
  elementDescription: "Label",
  css: `
    color: #BDBDBD;
    position: absolute;
    left: 12px;
    top: 4px;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.02em;
    pointer-events: none;
    transition: 0.2s ease color, 0.1s ease opacity, 0.1s ease transform;
    transform: translateY(9px);
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
  elementDescription: "Input",
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
    margin-right: 5px;
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
      transform: translateY(7px);
    `,
  },
});

const ShadowTextStyle = ElementStyle.givenDefinition({
  elementDescription: "ShadowText",
  css: `
    color: #BDBDBD;
    position: absolute;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
    margin-left: 12px;
    transform: translateY(0);
    opacity: 0;
    transition: 0.1s ease-out transform;
  `,
  modifiers: {
    hasValue: `
      opacity: 1;
      transform: translateY(7px);
    `,
  },
});
