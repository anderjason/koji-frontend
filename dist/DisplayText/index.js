"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayText = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
class DisplayText extends skytree_1.Actor {
    constructor(props) {
        super(props);
        KojiAppearance_1.KojiAppearance.preloadFonts();
    }
    onActivate() {
        const style = styleByDisplayType.get(this.props.displayType);
        if (style == null) {
            return;
        }
        const actor = this.addActor(style.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        const observableText = observable_1.Observable.givenValueOrObservable(this.props.text);
        this.cancelOnDeactivate(observableText.didChange.subscribe((text) => {
            actor.element.innerHTML = text || "";
        }, true));
        if (this.props.color != null) {
            const observableColor = observable_1.Observable.givenValueOrObservable(this.props.color);
            this.cancelOnDeactivate(observableColor.didChange.subscribe((color) => {
                if (color == null) {
                    return;
                }
                actor.style.color = color.toHexString();
            }, true));
        }
    }
}
exports.DisplayText = DisplayText;
const TitleStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Title",
    css: `
    border: none;
    color: #2D2F30;
    font-family: PT Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 34px;
    letter-spacing: 0.02em;
    user-select: none;
  `,
});
const styleByDisplayType = new Map();
styleByDisplayType.set("title", TitleStyle);
//# sourceMappingURL=index.js.map