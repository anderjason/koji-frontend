"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableText = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
class EditableText extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this.didFocus = new observable_1.TypedEvent();
        this.output =
            this.props.output || observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._maxLength = observable_1.Observable.givenValueOrObservable(this.props.maxLength);
    }
    onActivate() {
        const style = styleByDisplayType.get(this.props.displayType);
        const observableTheme = observable_1.Observable.givenValueOrObservable(this.props.theme || KojiAppearance_1.KojiAppearance.themes.get("kojiBlack"));
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
        this.cancelOnDeactivate(input.addManagedEventListener("focus", () => {
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
});
const DescriptionStyle = web_1.ElementStyle.givenDefinition({
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
    margin-bottom: -5px;
    outline: none;
    overflow: auto;
    padding: 0;
    resize: none;
    user-select: auto;
    width: 100%;

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
});
const styleByDisplayType = new Map();
styleByDisplayType.set("title", TitleStyle);
styleByDisplayType.set("description", DescriptionStyle);
//# sourceMappingURL=index.js.map