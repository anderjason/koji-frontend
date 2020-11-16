"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callout = void 0;
const geometry_1 = require("@anderjason/geometry");
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
class Callout extends skytree_1.Actor {
    constructor(props) {
        super(props);
        KojiAppearance_1.KojiAppearance.preloadFonts();
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
            transitionOut: async () => {
                wrapper.setModifier("isVisible", false);
                await time_1.Duration.givenSeconds(1.4).toDelay();
            },
        }));
        const span = document.createElement("span");
        wrapper.element.appendChild(span);
        const observableText = observable_1.Observable.givenValueOrObservable(this.props.text);
        this.cancelOnDeactivate(observableText.didChange.subscribe((text) => {
            if (text == null) {
                span.innerHTML = "";
            }
            else {
                span.innerHTML = text;
            }
        }, true));
        const parentBoundsWatcher = this.addActor(new web_1.ElementSizeWatcher({
            element: this.props.parentElement,
        }));
        const observableTargetBox = observable_1.Observable.givenValueOrObservable(this.props.targetBox);
        const pointBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            observableTargetBox,
            parentBoundsWatcher.output,
        ]));
        this.cancelOnDeactivate(pointBinding.didInvalidate.subscribe(() => {
            if (this.isActive.value == false) {
                return;
            }
            const targetBox = observableTargetBox.value;
            const availableSize = parentBoundsWatcher.output.value;
            if (targetBox == null) {
                return;
            }
            if (availableSize == null) {
                return;
            }
            const availableWidth = availableSize.width - 20;
            const wrapperBounds = wrapper.element.getBoundingClientRect();
            const wrapperSize = geometry_1.Size2.givenWidthHeight(wrapperBounds.width, wrapperBounds.height);
            const leftPoint = targetBox.toLeft() - wrapperSize.width - 15;
            const rightPoint = targetBox.toRight() + 15;
            wrapper.style.top = `${targetBox.center.y}px`;
            if (rightPoint + wrapperSize.width > availableWidth) {
                wrapper.setModifier("isPointingLeft", false);
                wrapper.style.left = `${leftPoint}px`;
            }
            else {
                wrapper.setModifier("isPointingLeft", true);
                wrapper.style.left = `${rightPoint}px`;
            }
            wrapper.setModifier("isVisible", true);
        }, true));
    }
}
exports.Callout = Callout;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    animation: 1.4s ease 0s infinite normal none running bounce;
    background-color: rgb(0, 122, 255);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    opacity: 0;
    padding: 6px 12px;
    position: absolute;
    transition: all 0.4s ease;
    user-select: none;
    white-space: nowrap;
    will-change: transform, opacity;
    z-index: 1000;
    
    &:after {
      -webkit-box-align: center;
      align-items: center;
      border-color: transparent transparent transparent rgb(0, 122, 255);
      border-style: solid;
      border-width: 8px 0px 8px 10px;
      content: "";
      display: flex;
      height: 0px;
      position: absolute;
      right: -7px;
      top: calc(50% - 8px);
      width: 0px;
    }

    @keyframes bounce { 
      0% { 
        transform: translate(3px, -50%);
      }
      50% { 
        transform: translate(-3px, -50%);
      }
      100% { 
        transform: translate(3px, -50%);
      }
    }
  `,
    modifiers: {
        isVisible: `
      opacity: 1;
    `,
        isPointingLeft: `
      &:after {
        border-color: transparent rgb(0, 122, 255) transparent transparent;  
        border-width: 8px 10px 8px 0px;
        left: -7px;
        right: auto;
      }
    `,
    },
});
//# sourceMappingURL=index.js.map