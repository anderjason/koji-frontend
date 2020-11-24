"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableText = void 0;
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
class EditableText extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this.didFocus = new observable_1.TypedEvent();
        this.output =
            this.props.output || observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
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
            const height = util_1.NumberUtil.numberWithHardLimit(input.element.scrollHeight, 25, 100);
            input.style.height = `${height}px`;
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
    appearance: none;
    border: none;
    font-family: PT Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 34px;
    letter-spacing: 0.02em;
    margin-top: -6px;
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
const DescriptionStyle = web_1.ElementStyle.givenDefinition({
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
const styleByDisplayType = new Map();
styleByDisplayType.set("title", TitleStyle);
styleByDisplayType.set("description", DescriptionStyle);
//# sourceMappingURL=index.js.map