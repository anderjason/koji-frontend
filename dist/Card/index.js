"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.cardTransitionEasing = exports.cardHeightAnimateDuration = exports.cardTransitionDuration = exports.headerAreaHeight = void 0;
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const CardLayout_1 = require("./_internal/CardLayout");
const CurrentLayoutHeight_1 = require("./_internal/CurrentLayoutHeight");
exports.headerAreaHeight = 40;
exports.cardTransitionDuration = time_1.Duration.givenSeconds(0.5);
exports.cardHeightAnimateDuration = time_1.Duration.givenSeconds(0.6);
exports.cardTransitionEasing = "cubic-bezier(.52,.01,.28,1)";
const backIconSvg = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor" /></svg>`;
class Card extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._layouts = observable_1.ObservableArray.ofEmpty();
        this._selectedLayout = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._maxHeight = observable_1.Observable.givenValueOrObservable(this.props.maxHeight, observable_1.Observable.isStrictEqual);
        this._mode = observable_1.Observable.givenValueOrObservable(this.props.mode || "visible", observable_1.Observable.isStrictEqual);
        this._anchorBottom = observable_1.Observable.givenValueOrObservable(this.props.anchorBottom);
        this.layouts = observable_1.ReadOnlyObservableArray.givenObservableArray(this._layouts);
        this.selectedLayout = observable_1.ReadOnlyObservable.givenObservable(this._selectedLayout);
    }
    get baseElement() {
        return this._baseLayout.element;
    }
    get baseFooterElement() {
        return this._baseLayout.footerElement;
    }
    get hiddenElement() {
        return this._hiddenWrapper.element;
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
        this._hiddenWrapper = this.addActor(HiddenWrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this._outer,
        }));
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
        const disableSliderAnimationLater = new time_1.Debounce({
            duration: exports.cardHeightAnimateDuration,
            fn: () => {
                this._slider.setModifier("isAnimated", false);
            },
        });
        this.cancelOnDeactivate(backButton.addManagedEventListener("click", () => {
            const layout = this._selectedLayout.value;
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
        const title = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        const selectedTitleBinding = this.addActor(new skytree_1.SourceTargetBinding({
            target: title,
        }));
        this.cancelOnDeactivate(title.didChange.subscribe((str) => {
            titleDiv.innerHTML = str || "";
        }, true));
        this.cancelOnDeactivate(this._selectedLayout.didChange.subscribe((layout, oldLayout) => {
            if (layout == null) {
                return;
            }
            if (oldLayout != null) {
                // animates height and left/right transition
                this._slider.setModifier("isAnimated", true);
                disableSliderAnimationLater.invoke();
            }
            const index = this._layouts.toIndexOfValue(layout);
            this._slider.style.transform = `translateX(${index * -100}%)`;
            // leave the title as-is if changing back to the first card, so the text can transition out
            if (index !== 0) {
                selectedTitleBinding.setSource(layout.title);
            }
            headerArea.setModifier("isVisible", index !== 0);
            backButton.setModifier("isVisible", index !== 0);
            titleArea.setModifier("isVisible", index !== 0);
        }, true));
        const currentLayoutHeight = this.addActor(new CurrentLayoutHeight_1.CurrentLayoutHeight({
            layout: this._selectedLayout,
        }));
        this.cancelOnDeactivate(this._mode.didChange.subscribe((mode) => {
            wrapper.setModifier("isHidden", mode === "hidden");
            this._hiddenWrapper.setModifier("isHidden", mode === "visible");
        }, true));
        this.cancelOnDeactivate(currentLayoutHeight.output.didChange.subscribe((height) => {
            if (height == null) {
                return;
            }
            this._slider.style.height = `${height}px`;
        }, true));
        this.cancelOnDeactivate(this._layouts.didChange.subscribe((layouts) => {
            if (layouts == null) {
                return;
            }
            this._selectedLayout.setValue(util_1.ArrayUtil.optionalLastValueGivenArray(layouts));
        }, true));
        this._baseLayout = this.addPage({
            anchorBottom: this._anchorBottom,
        });
    }
    addPage(options = {}) {
        return this.addActor(skytree_1.Actor.withDescription("CardLayout", new CardLayout_1.CardLayout({
            title: options.title,
            anchorBottom: options.anchorBottom,
            onRemoved: options.onRemoved,
            layouts: this._layouts,
            parentElement: this._slider.element,
            maxHeight: this._maxHeight,
        })));
    }
}
exports.Card = Card;
const HiddenWrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "HiddenWrapper",
    css: `
    box-sizing: border-box;
    color: #2D2F30;
    pointer-events: auto;
    position: absolute;
    bottom: 40px;
    left: 36px;
    right: 36px;
    transition: 0.4s ease opacity;
    
    .kft-text + .kft-control {
      margin-top: 11px;
    }

    .kft-control + .kft-control {
      margin-top: 15px;
    }
  `,
    modifiers: {
        isHidden: `
      opacity: 0;
      pointer-events: none;
    `,
    },
});
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    color: #2D2F30;
    margin: 20px 16px;
    overflow: hidden;
    position: relative;
    transition: 0.4s ease opacity;
    opacity: 1;
    width: calc(100% - 32px);
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    
    .kft-text + .kft-control {
      margin-top: 11px;
    }

    .kft-control + .kft-control {
      margin-top: 15px;
    }
  `,
    modifiers: {
        isHidden: `
      opacity: 0;
      pointer-events: none;
    `,
    },
});
const SliderStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Slider",
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
    elementDescription: "HeaderArea",
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
    font-size: 16px;
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