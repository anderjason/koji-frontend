"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callout = void 0;
const time_1 = require("@anderjason/time");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiTypography_1 = require("../KojiTypography");
class Callout extends skytree_1.Actor {
    constructor(props) {
        super(props);
        KojiTypography_1.KojiTypography.preloadFonts();
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
            transitionOut: async () => {
                wrapper.removeModifier("isVisible");
                await time_1.Duration.givenSeconds(0.4).toDelay();
            },
        }));
        const span = document.createElement("span");
        span.innerHTML = this.props.text;
        wrapper.element.appendChild(span);
        const pointBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            this.props.screenPoint,
            this.props.calloutSide,
            web_1.ScreenSize.instance.availableSize,
        ]));
        this.cancelOnDeactivate(pointBinding.didInvalidate.subscribe(() => {
            if (this.isActive.value == false) {
                return;
            }
            const screenPoint = this.props.screenPoint.value;
            const calloutSide = this.props.calloutSide.value;
            const availableSize = web_1.ScreenSize.instance.availableSize.value;
            if (screenPoint == null || calloutSide == null) {
                return;
            }
            wrapper.style.top = `${screenPoint.y}px`;
            if (calloutSide === "right") {
                wrapper.style.left = `${screenPoint.x + 7}px`;
                wrapper.style.right = null;
            }
            else {
                wrapper.style.left = null;
                wrapper.style.right = `${availableSize.width - screenPoint.x + 7}px`;
            }
            wrapper.addModifier("isVisible");
        }, true));
        this.cancelOnDeactivate(this.props.calloutSide.didChange.subscribe((calloutSide) => {
            if (calloutSide == null) {
                return;
            }
            wrapper.setModifier("isPointingLeft", calloutSide === "right");
        }, true));
    }
}
exports.Callout = Callout;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
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
    transition: all 0.4s ease-in-out;
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
      opacity: 1
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