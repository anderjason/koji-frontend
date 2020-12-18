"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableText = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
class EditableText extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._isFocused = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.isFocused = observable_1.ReadOnlyObservable.givenObservable(this._isFocused);
        this.didFocus = new observable_1.TypedEvent();
        this.output =
            this.props.output || observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._isInvalid = this.props.isInvalid || observable_1.Observable.givenValue(false, observable_1.Observable.isStrictEqual);
        this._maxLength = observable_1.Observable.givenValueOrObservable(this.props.maxLength);
    }
    onActivate() {
        const style = styleByDisplayType.get(this.props.displayType);
        const observableTheme = observable_1.Observable.givenValueOrObservable(this.props.theme);
        let input;
        switch (this.props.displayType) {
            case "title":
                input = this.addActor(style.toManagedElement({
                    tagName: "textarea",
                    parentElement: this.props.parentElement,
                }));
                break;
            case "description":
                input = this.addActor(style.toManagedElement({
                    tagName: "textarea",
                    parentElement: this.props.parentElement,
                }));
                break;
            default:
                throw new Error(`Unsupported display type '${this.props.displayType}`);
        }
        input.element.classList.add("kft-text");
        input.element.placeholder = this.props.placeholderLabel;
        this.cancelOnDeactivate(this._maxLength.didChange.subscribe(maxLength => {
            if (maxLength == null) {
                input.element.removeAttribute("maxLength");
            }
            else {
                input.element.maxLength = maxLength;
            }
        }, true));
        this.addActor(new web_1.FocusWatcher({
            element: input.element,
            output: this._isFocused,
        }));
        this.cancelOnDeactivate(this._isFocused.didChange.subscribe(isFocused => {
            if (isFocused != true) {
                return;
            }
            input.element.setSelectionRange(0, (input.element.value || "").length);
            this.didFocus.emit();
        }));
        this.addActor(new web_1.TextInputBinding({
            inputElement: input.element,
            value: this.output,
            displayTextGivenValue: (v) => v,
            valueGivenDisplayText: (v) => v,
        }));
        this.cancelOnDeactivate(this.output.didChange.subscribe(() => {
            input.style.height = "25px";
            input.style.height = `${input.element.scrollHeight}px`;
        }, true));
        this.cancelOnDeactivate(this._isInvalid.didChange.subscribe(isInvalid => {
            input.setModifier("isInvalid", isInvalid);
        }, true));
        this.cancelOnDeactivate(observableTheme.didChange.subscribe((theme) => {
            if (theme == null) {
                return;
            }
            if (this.props.displayType === "title") {
                theme.applyTextStyle(input.element);
            }
        }, true));
    }
}
exports.EditableText = EditableText;
const TitleStyle = web_1.ElementStyle.givenDefinition({
    css: `
    -webkit-user-select: auto;
    appearance: none;
    background: none;
    border: none;
    border-radius: 6px;
    color: rgb(45, 47, 48);
    font-family: PT Sans;
    font-size: 26px;
    font-style: normal;
    font-weight: bold;
    letter-spacing: 0.02em;
    line-height: 34px;
    margin-top: -6px;
    margin-left: -6px;
    margin-right: -6px;
    outline: none;
    padding: 0 6px;
    resize: none;
    transition: 0.2s ease color, 0.2s ease background;
    user-select: auto;
    width: 100%;
    -webkit-tap-highlight-color: transparent;

    &::placeholder {
      color: #BDBDBD;
    }

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
      border: 8.75px solid transparent;
      box-shadow: inset 0 0 0 10px;
      color: #e1e1e1;
    }

    &:hover, &:focus {
      &::-webkit-scrollbar-thumb {
        color: #888;
      } 
    }
  `,
    modifiers: {
        isInvalid: `
      background-color: rgba(235, 87, 87, 0.2);
      border-color: #d64d43a8;

      &::placeholder {
        color: #af6e6a66;
      }  
    `
    }
});
const DescriptionStyle = web_1.ElementStyle.givenDefinition({
    css: `
    -webkit-user-select: auto;
    appearance: none;
    border: none;
    border-radius: 6px;
    color: #2D2F30;
    font-family: Source Sans Pro;
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    height: 25px;
    letter-spacing: 0.02em;
    line-height: 25px;
    margin-top: -3px;
    margin-bottom: -5px;
    margin-left: -6px;
    margin-right: -6px;
    outline: none;
    overflow: hidden;
    padding: 0 6px;
    resize: none;
    transition: 0.2s ease color, 0.2s ease background;
    user-select: auto;
    width: 100%;
    -webkit-tap-highlight-color: transparent;

    &::placeholder {
      color: #BDBDBD;
    }

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
      border: 8.75px solid transparent;
      box-shadow: inset 0 0 0 10px;
      color: #e1e1e1;
    }

    &:hover, &:focus {
      &::-webkit-scrollbar-thumb {
        color: #888;
      } 
    }
  `,
    modifiers: {
        isInvalid: `
      background-color: rgba(235, 87, 87, 0.2);
      border-color: #d64d43a8;

      &::placeholder {
        color: #af6e6a66;
      }
    `
    }
});
const styleByDisplayType = new Map();
styleByDisplayType.set("title", TitleStyle);
styleByDisplayType.set("description", DescriptionStyle);
//# sourceMappingURL=index.js.map