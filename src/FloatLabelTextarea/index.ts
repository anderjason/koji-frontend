import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { NumberUtil, StringUtil } from "@anderjason/util";
import {
  ElementStyle,
  FocusWatcher,
  TextInputBinding,
} from "@anderjason/web";
import { TextInputBindingOverrideResult, TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor, MultiBinding } from "skytree";
import { KojiAppearance } from "../KojiAppearance";

export interface FloatLabelTextareaProps<T> {
  displayTextGivenValue: (value: T) => string;
  overrideDisplayText?: (e: TextInputChangingData<T>) => string | TextInputBindingOverrideResult;
  parentElement: HTMLElement;
  value: Observable<T>;
  valueGivenDisplayText: (displayText: string) => T;
  
  persistentLabel?: string | ObservableBase<string>;
  placeholderLabel?: string | ObservableBase<string>;
  supportLabel?: string | ObservableBase<string>;
  errorLabel?: string | ObservableBase<string>;
  maxLength?: number | ObservableBase<number>;
  minRows?: number | ObservableBase<number>;
  maxRows?: number | ObservableBase<number>;
}

const rowHeight = 25;

export class FloatLabelTextarea<T> extends Actor<FloatLabelTextareaProps<T>> {
  private _errorLabel: ObservableBase<string>;
  private _isFocused = Observable.ofEmpty<boolean>(Observable.isStrictEqual);
  private _maxLength: ObservableBase<number>;
  private _maxRows: ObservableBase<number>;
  private _minRows: ObservableBase<number>;
  private _persistentLabel: ObservableBase<string>;
  private _placeholderLabel: ObservableBase<string>;
  private _supportLabel: ObservableBase<string>;

  readonly isFocused = ReadOnlyObservable.givenObservable(this._isFocused);

  constructor(props: FloatLabelTextareaProps<T>) {
    super(props);

    KojiAppearance.preloadFonts();

    this._errorLabel = Observable.givenValueOrObservable(this.props.errorLabel);
    this._maxLength = Observable.givenValueOrObservable(this.props.maxLength);
    this._maxRows = Observable.givenValueOrObservable(this.props.maxRows);
    this._minRows = Observable.givenValueOrObservable(this.props.minRows);
    this._persistentLabel = Observable.givenValueOrObservable(this.props.persistentLabel);
    this._placeholderLabel = Observable.givenValueOrObservable(this.props.placeholderLabel);
    this._supportLabel = Observable.givenValueOrObservable(this.props.supportLabel);
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-control");

    const borderArea = this.addActor(
      BorderAreaStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );

    const textarea = this.addActor(
      TextareaStyle.toManagedElement({
        tagName: "textarea",
        parentElement: borderArea.element,
      })
    );

    const note = this.addActor(
      NoteStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );
    
    const noteBinding = this.addActor(
      MultiBinding.givenAnyChange([
        this._supportLabel,
        this._errorLabel
      ])
    );

    this.cancelOnDeactivate(
      noteBinding.didInvalidate.subscribe(() => {
        const errorText = this._errorLabel.value;
        const noteText = this._supportLabel.value;

        if (!StringUtil.stringIsEmpty(errorText)) {
          borderArea.setModifier("isInvalid", true);
          note.setModifier("isInvalid", true);
          note.setModifier("isVisible", true);
          note.element.innerHTML = errorText;
        } else {
          borderArea.setModifier("isInvalid", false);
          note.setModifier("isInvalid", false);
          note.setModifier("isVisible", !StringUtil.stringIsEmpty(noteText));
          note.element.innerHTML = noteText || "";
        }
      }, true)
    );

    this.cancelOnDeactivate(
      this._placeholderLabel.didChange.subscribe(text => {
        textarea.element.placeholder = text || "";
      }, true)
    )

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
      borderArea.addManagedEventListener("click", () => {
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

    const heightBinding = this.addActor(
      MultiBinding.givenAnyChange([
        this.props.value,
        this._minRows,
        this._maxRows
      ])
    );

    this.cancelOnDeactivate(
      heightBinding.didInvalidate.subscribe(() => {
        textarea.style.height = `${rowHeight}px`;

        const minRows = this._minRows.value || 1;
        const maxRows = this._maxRows.value || 1000;

        const minHeight = minRows * rowHeight;
        const maxHeight = maxRows * rowHeight;
        
        const contentHeight = textarea.element.scrollHeight;
        const actualHeight = NumberUtil.numberWithHardLimit(contentHeight, minHeight, maxHeight);

        textarea.style.height = `${actualHeight}px`;
        borderArea.style.height = `${actualHeight + 25}px`;
      }, true)
    );

    const label = this.addActor(
      LabelStyle.toManagedElement({
        tagName: "label",
        parentElement: borderArea.element,
      })
    );

    const hasValueBinding = this.addActor(
      MultiBinding.givenAnyChange([
        inputBinding.isEmpty,
        this._persistentLabel
      ])
    );

    this.cancelOnDeactivate(
      hasValueBinding.didInvalidate.subscribe(() => {
        const isEmpty = inputBinding.isEmpty.value;
        const persistentLabel = this._persistentLabel.value;

        textarea.setModifier("hasValue", isEmpty == false && !StringUtil.stringIsEmpty(persistentLabel));
        label.setModifier("hasValue", !isEmpty);
      }, true)
    );

    this.cancelOnDeactivate(
      this._persistentLabel.didChange.subscribe(text => {
        label.element.innerHTML = text || "";
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    text-align: left;
  `
});

const BorderAreaStyle = ElementStyle.givenDefinition({
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
    font-style: normal;
    font-weight: 400;
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
    font-family: inherit;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
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

    &::-webkit-scrollbar {
      width: 22px;
      height: 22px;
      border-radius: 13px;
      background-clip: padding-box;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      border-radius: 13px;
      background-clip: padding-box;
      border: 9px solid transparent;
      box-shadow: inset 0 0 0 10px;
      color: #222;
    }

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

const NoteStyle = ElementStyle.givenDefinition({
  elementDescription: "Note",
  css: `
    color: #0000004C;
    display: none;
    font-size: 14px;
    font-weight: 400;
    padding: 5px 1px 0 1px;
    transition: 0.2s ease color;
  `,
  modifiers: {
    isVisible: `
      display: block;
    `,
    isInvalid: `
      color: #d64d43;
    `
  }
});
