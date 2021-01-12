"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatLabelTextInput = void 0;
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
class FloatLabelTextInput extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._isFocused = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.isFocused = observable_1.ReadOnlyObservable.givenObservable(this._isFocused);
        KojiAppearance_1.KojiAppearance.preloadFonts();
        this._errorLabel = observable_1.Observable.givenValueOrObservable(this.props.errorLabel);
        this._maxLength = observable_1.Observable.givenValueOrObservable(this.props.maxLength);
        this._persistentLabel = observable_1.Observable.givenValueOrObservable(this.props.persistentLabel);
        this._placeholderLabel = observable_1.Observable.givenValueOrObservable(this.props.placeholderLabel);
        this._supportLabel = observable_1.Observable.givenValueOrObservable(this.props.supportLabel);
    }
    get displayText() {
        return this._input.element.value;
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        wrapper.element.classList.add("kft-control");
        const borderArea = this.addActor(BorderAreaStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        this._input = this.addActor(InputStyle.toManagedElement({
            tagName: "input",
            parentElement: borderArea.element,
        }));
        const inputType = this.props.inputType || "text";
        this._input.element.type = inputType;
        if (this.props.inputMode != null) {
            this._input.element.inputMode = this.props.inputMode;
        }
        const note = this.addActor(NoteStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        const noteBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            this._supportLabel,
            this._errorLabel
        ]));
        this.cancelOnDeactivate(noteBinding.didInvalidate.subscribe(() => {
            const errorText = this._errorLabel.value;
            const noteText = this._supportLabel.value;
            if (!util_1.StringUtil.stringIsEmpty(errorText)) {
                borderArea.setModifier("isInvalid", true);
                note.setModifier("isInvalid", true);
                note.setModifier("isVisible", true);
                note.element.innerHTML = errorText;
            }
            else {
                borderArea.setModifier("isInvalid", false);
                note.setModifier("isInvalid", false);
                note.setModifier("isVisible", !util_1.StringUtil.stringIsEmpty(noteText));
                note.element.innerHTML = noteText || "";
            }
        }, true));
        this.cancelOnDeactivate(this._maxLength.didChange.subscribe((maxLength) => {
            if (maxLength == null) {
                this._input.element.removeAttribute("maxLength");
            }
            else {
                this._input.element.maxLength = maxLength;
            }
        }, true));
        this.cancelOnDeactivate(this._placeholderLabel.didChange.subscribe(text => {
            this._input.element.placeholder = text || "";
        }, true));
        this.cancelOnDeactivate(borderArea.addManagedEventListener("click", () => {
            this._input.element.focus();
        }));
        this.addActor(new web_1.FocusWatcher({
            element: this._input.element,
            output: this._isFocused,
        }));
        const inputBinding = this.addActor(new web_1.TextInputBinding({
            inputElement: this._input.element,
            value: this.props.value,
            displayTextGivenValue: this.props.displayTextGivenValue,
            valueGivenDisplayText: this.props.valueGivenDisplayText,
            overrideDisplayText: this.props.overrideDisplayText,
        }));
        this.cancelOnDeactivate(this._isFocused.didChange.subscribe((isFocused) => {
            if (isFocused == true) {
                // setSelectionRange is not supported on number inputs
                if (inputType === "text") {
                    this._input.element.setSelectionRange(0, (this._input.element.value || "").length);
                }
            }
        }));
        const label = this.addActor(LabelStyle.toManagedElement({
            tagName: "label",
            parentElement: borderArea.element,
        }));
        this.cancelOnDeactivate(inputBinding.isEmpty.didChange.subscribe((isEmpty) => {
            this._input.setModifier("hasValue", !isEmpty);
            label.setModifier("hasValue", !isEmpty);
        }, true));
        this.cancelOnDeactivate(this._persistentLabel.didChange.subscribe(text => {
            label.element.innerHTML = text || "";
        }, true));
    }
}
exports.FloatLabelTextInput = FloatLabelTextInput;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
  `
});
const BorderAreaStyle = web_1.ElementStyle.givenDefinition({
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
    `,
    },
});
const LabelStyle = web_1.ElementStyle.givenDefinition({
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
const InputStyle = web_1.ElementStyle.givenDefinition({
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
const NoteStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Note",
    css: `
    color: #0000004C;
    display: none;
    font-size: 14px;
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
//# sourceMappingURL=index.js.map