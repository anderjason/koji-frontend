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
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        let shadowText;
        if (this.props.shadowTextGivenValue != null) {
            shadowText = this.addActor(ShadowTextStyle.toManagedElement({
                tagName: "span",
                parentElement: wrapper.element,
            }));
        }
        const input = this.addActor(InputStyle.toManagedElement({
            tagName: "input",
            parentElement: wrapper.element,
        }));
        const inputType = this.props.inputType || "text";
        input.element.type = inputType;
        if (this.props.placeholder != null) {
            input.element.placeholder = this.props.placeholder;
        }
        this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
            input.element.focus();
        }));
        this.addActor(new web_1.FocusWatcher({
            element: input.element,
            output: this._isFocused,
        }));
        const applyShadowText = () => {
            if (this.props.shadowTextGivenValue != null &&
                this.props.applyShadowTextOnBlur == true) {
                const text = this.props.shadowTextGivenValue(this.props.value.value);
                if (text != null) {
                    input.element.value = text;
                }
            }
        };
        if (inputType === "text") {
            // setSelectionRange is not supported on number inputs
            this.cancelOnDeactivate(this._isFocused.didChange.subscribe((isFocused) => {
                if (isFocused == true) {
                    input.element.setSelectionRange(0, (input.element.value || "").length);
                }
                else {
                    applyShadowText();
                }
            }));
        }
        const inputBinding = this.addActor(new web_1.TextInputBinding({
            inputElement: input.element,
            value: this.props.value,
            displayTextGivenValue: this.props.displayTextGivenValue,
            valueGivenDisplayText: this.props.valueGivenDisplayText,
            overrideDisplayText: this.props.overrideDisplayText,
        }));
        if (shadowText != null && this.props.shadowTextGivenValue != null) {
            this.cancelOnDeactivate(this.props.value.didChange.subscribe(() => {
                const text = this.props.shadowTextGivenValue(this.props.value.value);
                if (text == null) {
                    shadowText.element.innerHTML = "";
                }
                else {
                    shadowText.element.innerHTML = text;
                }
            }, true));
        }
        if (!util_1.StringUtil.stringIsEmpty(this.props.persistentLabel)) {
            const label = this.addActor(LabelStyle.toManagedElement({
                tagName: "label",
                parentElement: wrapper.element,
            }));
            label.element.innerHTML = this.props.persistentLabel;
            this.cancelOnDeactivate(inputBinding.isEmpty.didChange.subscribe((isEmpty) => {
                input.setModifier("hasValue", !isEmpty);
                label.setModifier("hasValue", !isEmpty);
                if (shadowText != null) {
                    shadowText.setModifier("hasValue", !isEmpty);
                }
            }, true));
        }
        applyShadowText();
    }
}
exports.FloatLabelTextInput = FloatLabelTextInput;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
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
const LabelStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Label",
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
const ShadowTextStyle = web_1.ElementStyle.givenDefinition({
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
      transform: translateY(8px);
    `,
    },
});
//# sourceMappingURL=index.js.map