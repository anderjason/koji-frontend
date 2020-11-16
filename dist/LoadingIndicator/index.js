"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingIndicator = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const radius = 20;
const strokeWidth = 3;
const diameter = radius * 2;
const circumference = Math.PI * diameter;
class LoadingIndicator extends skytree_1.Actor {
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._svg.setAttribute("aria-hidden", "true");
        this._svg.setAttribute("viewBox", `0 0 ${diameter} ${diameter}`);
        this._svg.setAttribute("width", "20px");
        this._svg.setAttribute("height", "20px");
        this._svg.setAttribute("class", SvgStyle.toCombinedClassName());
        wrapper.element.appendChild(this._svg);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._svg.appendChild(circle);
        circle.setAttribute("stroke", "black");
        circle.setAttribute("fill", "none");
        circle.setAttribute("cx", `${radius}px`);
        circle.setAttribute("cy", `${radius}px`);
        circle.setAttribute("r", `${radius - strokeWidth}px`);
        if (this.props.color != null) {
            if (observable_1.Observable.isObservable(this.props.color)) {
                this.cancelOnDeactivate(this.props.color.didChange.subscribe((color) => {
                    if (color == null) {
                        circle.setAttribute("stroke", null);
                    }
                    else {
                        circle.setAttribute("stroke", color.toHexString());
                    }
                }, true));
            }
            else {
                circle.setAttribute("stroke", this.props.color.toHexString());
            }
        }
        else {
            circle.setAttribute("stroke", "#007AFF");
        }
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            wrapper.element.removeChild(this._svg);
            this._svg = undefined;
        }));
    }
}
exports.LoadingIndicator = LoadingIndicator;
const animId = "anim" + util_1.StringUtil.stringOfRandomCharacters(8);
const animId2 = "anim" + util_1.StringUtil.stringOfRandomCharacters(8);
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
});
const SvgStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Svg",
    css: `
    @keyframes ${animId} {
      0% {
        stroke-dashoffset: 0;
      }
      
      100% {
        stroke-dashoffset: ${-circumference * 2};
      }
    }
  
    @keyframes ${animId2} {
      0% {
        transform: rotate(0);
      }
      
      100% {
        transform: rotate(360deg);
      }
    }

    user-select: none;
    pointer-events: none;
    overflow: visible;
    transform-origin: 50% 50%;
    animation: 2s linear infinite ${animId2};

    circle {
      stroke-width: ${strokeWidth}px;
      stroke-linecap: round;
      stroke-dasharray: ${circumference};
      animation: 3s linear infinite ${animId};
    }
  `,
});
//# sourceMappingURL=index.js.map