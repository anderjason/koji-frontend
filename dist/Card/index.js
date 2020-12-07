"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.cardTransitionEasing = exports.cardTransitionDuration = exports.totalVerticalPadding = exports.headerAreaHeight = void 0;
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const CardLayout_1 = require("./_internal/CardLayout");
const CurrentLayoutHeight_1 = require("./_internal/CurrentLayoutHeight");
exports.headerAreaHeight = 40;
exports.totalVerticalPadding = 40;
exports.cardTransitionDuration = time_1.Duration.givenSeconds(0.5);
exports.cardTransitionEasing = "cubic-bezier(.52,.01,.28,1)";
const backIconSvg = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor" /></svg>`;
class Card extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._layouts = observable_1.ObservableArray.ofEmpty();
        this._maxHeight = observable_1.Observable.givenValueOrObservable(this.props.maxHeight || 500, observable_1.Observable.isStrictEqual);
    }
    get baseElement() {
        return this._baseLayout.element;
    }
    onActivate() {
        switch (this.props.target.type) {
            case "thisElement":
                this._outer = this.props.target.element;
                break;
            case "parentElement":
                this._outer = this.addActor(web_1.ManagedElement.givenDefinition({
                    tagName: "div",
                    parentElement: this.props.target.parentElement,
                })).element;
                break;
            default:
                throw new Error("An element is required (this or parent)");
        }
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this._outer,
        }));
        this._slider = this.addActor(SliderStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        const headerArea = this.addActor(HeaderAreaStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        const backButton = this.addActor(BackButtonStyle.toManagedElement({
            tagName: "button",
            parentElement: headerArea.element,
        }));
        const backIcon = document.createElement("svg");
        backButton.element.appendChild(backIcon);
        backIcon.outerHTML = backIconSvg;
        const backLabel = document.createElement("span");
        backLabel.innerHTML = "Back";
        backButton.element.appendChild(backLabel);
        this.cancelOnDeactivate(backButton.addManagedEventListener("click", () => {
            const layout = selectedLayout.value;
            if (layout == null || this._layouts.count < 2) {
                return;
            }
            layout.deactivate();
        }));
        const titleArea = this.addActor(TitleAreaStyle.toManagedElement({
            tagName: "div",
            parentElement: headerArea.element,
        }));
        const titleDiv = document.createElement("div");
        titleArea.element.appendChild(titleDiv);
        const selectedLayout = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.cancelOnDeactivate(selectedLayout.didChange.subscribe((layout) => {
            if (layout == null) {
                return;
            }
            const index = this._layouts.toIndexOfValue(layout);
            this._slider.style.transform = `translateX(${index * -100}%)`;
            if (index !== 0) {
                // leave the title as-is if changing back to the first card, so the text can transition out
                titleDiv.innerHTML = layout.props.title || "";
            }
            headerArea.setModifier("isVisible", index !== 0);
            backButton.setModifier("isVisible", index !== 0);
            titleArea.setModifier("isVisible", index !== 0);
        }, true));
        const currentLayoutHeight = this.addActor(new CurrentLayoutHeight_1.CurrentLayoutHeight({
            layout: selectedLayout,
        }));
        this.cancelOnDeactivate(currentLayoutHeight.output.didChange.subscribe((height) => {
            if (height == null) {
                return;
            }
            this._slider.style.height = `${height}px`;
            if (!this._slider.toModifiers().includes("isAnimated")) {
                setTimeout(() => {
                    this._slider.setModifier("isAnimated", true);
                }, 10);
            }
        }, true));
        this.cancelOnDeactivate(this._layouts.didChange.subscribe((layouts) => {
            if (layouts == null) {
                return;
            }
            selectedLayout.setValue(util_1.ArrayUtil.optionalLastValueGivenArray(layouts));
        }, true));
        this._baseLayout = this.addPage();
    }
    addPage(options = {}) {
        return this.addActor(new CardLayout_1.CardLayout({
            title: options.title,
            layouts: this._layouts,
            parentElement: this._slider.element,
            maxHeight: this._maxHeight,
        }));
    }
}
exports.Card = Card;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    color: #2D2F30;
    margin: 20px;
    overflow: hidden;
    position: relative;
    width: calc(100% - 40px);
    
    .kft-text + .kft-control {
      margin-top: 11px;
    }

    .kft-control + .kft-control {
      margin-top: 15px;
    }
  `,
});
const SliderStyle = web_1.ElementStyle.givenDefinition({
    css: `
    height: 50px;    
  `,
    modifiers: {
        isAnimated: `
      transition: ${exports.cardTransitionDuration.toSeconds()}s ${exports.cardTransitionEasing} all;
    `,
    },
});
const HeaderAreaStyle = web_1.ElementStyle.givenDefinition({
    css: `
    background: #FFF;
    border-bottom: 1px solid #EEE;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    height: ${exports.headerAreaHeight}px;
    left: 0;
    opacity: 0;
    position: absolute;
    pointer-events: none;
    right: 0;
    top: 0;
    transition: ${exports.cardTransitionDuration.toSeconds()}s ${exports.cardTransitionEasing} opacity;
  `,
    modifiers: {
        isVisible: `
      opacity: 1; 
      pointer-events: auto;
    `,
    },
});
const BackButtonStyle = web_1.ElementStyle.givenDefinition({
    css: `
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    color: #007AFF;
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0;
    outline: none;
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 0 20px;
    transform: translateX(100px);
    transition: ${exports.cardTransitionDuration.toSeconds()}s ${exports.cardTransitionEasing} transform;
    user-select: none;

    svg {
      height: 32px;
      margin: 1px -3px 0 -16px;
      width: 32px;
    }
  `,
    modifiers: {
        isVisible: `
      pointer-events: auto;
      transform: none;
    `,
    },
});
const TitleAreaStyle = web_1.ElementStyle.givenDefinition({
    css: `
    align-items: center;
    bottom: 0;
    display: flex;
    font-weight: bold;
    justify-content: center;
    left: 80px;
    pointer-events: none;
    position: absolute;
    right: 80px;
    top: 0;
    transform: translateX(200px);
    transition: ${exports.cardTransitionDuration.toSeconds()}s ${exports.cardTransitionEasing} transform;
    user-select: none;

    div {
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }
  `,
    modifiers: {
        isVisible: `
      transform: none;
    `,
    },
});
//# sourceMappingURL=index.js.map