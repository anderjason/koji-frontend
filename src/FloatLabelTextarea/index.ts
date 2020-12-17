import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import {
  ElementStyle,
  FocusWatcher,
  TextInputBinding,
} from "@anderjason/web";
import { TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
import { KojiAppearance } from "../KojiAppearance";

export interface FloatLabelTextareaProps<T> {
  displayTextGivenValue: (value: T) => string;
  overrideDisplayText?: (e: TextInputChangingData<T>) => string;
  parentElement: HTMLElement;
  value: Observable<T>;
  valueGivenDisplayText: (displayText: string) => T;
  
  isInvalid?: ObservableBase<boolean>;
  persistentLabel?: string;
  placeholder?: string;
  maxLength?: number | ObservableBase<number>;
}

export class FloatLabelTextarea<T> extends Actor<FloatLabelTextareaProps<T>> {
  private _isInvalid: ObservableBase<boolean>;
  private _maxLength: ObservableBase<number>;

  private _isFocused = Observable.ofEmpty<boolean>(Observable.isStrictEqual);
  readonly isFocused = ReadOnlyObservable.givenObservable(this._isFocused);

  constructor(props: FloatLabelTextareaProps<T>) {
    super(props);

    KojiAppearance.preloadFonts();

    this._isInvalid = this.props.isInvalid || Observable.givenValue(false, Observable.isStrictEqual);
    this._maxLength = Observable.givenValueOrObservable(this.props.maxLength);
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-control");

    const textarea = this.addActor(
      TextareaStyle.toManagedElement({
        tagName: "textarea",
        parentElement: wrapper.element,
      })
    );

    if (this.props.placeholder != null) {
      textarea.element.placeholder = this.props.placeholder;
    }

    this.cancelOnDeactivate(
      this._maxLength.didChange.subscribe(maxLength => {
        if (maxLength == null) {
          textarea.element.removeAttribute("maxLength");
        } else {
          textarea.element.maxLength = maxLength;
        }
      }, true)
    )


    this.cancelOnDeactivate(
      wrapper.addManagedEventListener("click", () => {
        textarea.element.focus();
      })
    );

    this.addActor(
      new FocusWatcher({
        element: textarea.element,
        output: this._isFocused,
      })
    );

    // setSelectionRange is not supported on number inputs
    this.cancelOnDeactivate(
      this._isFocused.didChange.subscribe((isFocused) => {
        if (isFocused == true) {
          textarea.element.setSelectionRange(
            0,
            (textarea.element.value || "").length
          );
        }
      })
    );

    const inputBinding = this.addActor(
      new TextInputBinding<T>({
        inputElement: textarea.element,
        value: this.props.value,
        displayTextGivenValue: this.props.displayTextGivenValue,
        valueGivenDisplayText: this.props.valueGivenDisplayText,
        overrideDisplayText: this.props.overrideDisplayText,
      })
    );

    this.cancelOnDeactivate(
      this._isInvalid.didChange.subscribe(isInvalid => {
        wrapper.setModifier("isInvalid", isInvalid);
      }, true)
    );

    this.cancelOnDeactivate(
      this.props.value.didChange.subscribe(() => {
        textarea.style.height = "25px";

        const textHeight = textarea.element.scrollHeight;
        textarea.style.height = `${textHeight}px`;
        wrapper.style.height = `${textHeight + 25}px`;
      }, true)
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
          textarea.setModifier("hasValue", !isEmpty);
          label.setModifier("hasValue", !isEmpty);
        }, true)
      );
    }
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
    margin-left: -2px;
    margin-right: -2px;
    outline: none;
    pointer-events: auto;
    position: relative;
    user-select: auto;
    width: calc(100% + 4px);
    transition: 0.2s ease border-color, 0.2s ease background;

    &:focus-within {
      border-color: #007AFF;

      label {
        color: #007AFF;
      }
    }
  `,
  modifiers: {
    isInvalid: `
      background-color: rgba(235, 87, 87, 0.2);
      border-color: #d64d43a8;

      &:focus-within {
        label {
          color: #d64d43;
        }
      }

      &::placeholder {
        color: #af6e6a66;
      }
    `
  }
});

const LabelStyle = ElementStyle.givenDefinition({
  elementDescription: "Label",
  css: `
    color: #0000004C;
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

const TextareaStyle = ElementStyle.givenDefinition({
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
    transition: 0.1s ease-out transform;
    user-select: auto;
    padding: 0;
    resize: none;
    width: 100%;
    -webkit-user-select: auto;
    -webkit-tap-highlight-color: transparent;

    &::placeholder {
      color: #0000004C;
    }
  `,
  modifiers: {
    hasValue: `
      transform: translateY(7px);
    `,
  },
});
