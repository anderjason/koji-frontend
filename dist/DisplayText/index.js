"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayText = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
const Description_1 = require("./_internal/Description");
class DisplayText extends skytree_1.Actor {
    constructor(props) {
        super(props);
        KojiAppearance_1.KojiAppearance.preloadFonts();
    }
    onActivate() {
        const observableText = observable_1.Observable.givenValueOrObservable(this.props.text);
        if (styleByDisplayType.has(this.props.displayType)) {
            const style = styleByDisplayType.get(this.props.displayType);
            const div = this.addActor(style.toManagedElement({
                tagName: "div",
                parentElement: this.props.parentElement,
            }));
            div.element.classList.add("kft-text");
            this.cancelOnDeactivate(observableText.didChange.subscribe((text) => {
                div.element.innerHTML = text || "";
            }, true));
            return;
        }
        if (this.props.displayType === "description") {
            this.addActor(new Description_1.Description({
                parentElement: this.props.parentElement,
                text: observableText,
            }));
        }
    }
}
exports.DisplayText = DisplayText;
const TitleStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Title",
    css: `
    border: none;
    color: #2D2F30;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 34px;
    letter-spacing: 0.02em;
    margin-top: -4px;
    text-align: left;
    user-select: none;
    white-space: pre-wrap;
  `,
});
const styleByDisplayType = new Map();
styleByDisplayType.set("title", TitleStyle);
//# sourceMappingURL=index.js.map