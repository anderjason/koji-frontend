"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleButton = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const switchSvg = `
  <svg width="59" height="36" viewBox="0 0 47 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect
        class="rect"
        x="3"
        y="3.5"
        width="41"
        height="22"
        rx="11"
        fill="transparent"
      />
      <ellipse class="ellipse" cx="14.5" cy="14.5" rx="9.5" ry="9" fill="#fff" />
    </g>
  </svg>
`;
class ToggleButton extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this.onClick = (e) => {
            e === null || e === void 0 ? void 0 : e.stopPropagation();
            this.props.isToggleActive.setValue(!this.props.isToggleActive.value);
        };
        this._isDisabled = observable_1.Observable.givenValueOrObservable(this.props.isDisabled);
    }
    onActivate() {
        let button;
        switch (this.props.target.type) {
            case "thisElement":
                button = this.props.target.element;
                break;
            case "parentElement":
                button = this.addActor(web_1.ManagedElement.givenDefinition({
                    tagName: "button",
                    parentElement: this.props.target.parentElement,
                })).element;
                break;
            default:
                throw new Error("An element is required (this or parent)");
        }
        button.type = "button";
        button.innerHTML = switchSvg;
        button.addEventListener("click", this.onClick);
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            button.removeEventListener("click", this.onClick);
        }));
        this.cancelOnDeactivate(this._isDisabled.didChange.subscribe(isDisabled => {
            button.disabled = isDisabled !== null && isDisabled !== void 0 ? isDisabled : false;
        }, true));
        this.cancelOnDeactivate(this.props.isToggleActive.didChange.subscribe((isActive) => {
            if (isActive == true) {
                button.className = ButtonStyle.toCombinedClassName("isActive");
            }
            else {
                button.className = ButtonStyle.toCombinedClassName();
            }
        }, true));
    }
}
exports.ToggleButton = ToggleButton;
const ButtonStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Button",
    css: `
    appearance: none;
    background: transparent;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 36px;
    outline: none;
    opacity: 1;
    padding: 0;
    pointer-events: auto;
    transition: 0.3s ease opacity;
    -webkit-tap-highlight-color: transparent;

    &:disabled {
      opacity: 0.9;
      cursor: auto;
    }

    svg {    
      margin-left: -4px;
      margin-right: -4px;

      .ellipse {
        transition: 0.3s ease cx;
      }

      .rect {
        transition: 0.3s ease fill;
        fill: rgb(235, 235, 235);
      }
    }
  `,
    modifiers: {
        isActive: `
      &:disabled {
        opacity: 0.25;
        cursor: auto;
      }

      svg {
        .ellipse {
          cx: 32.5px;
        }

        .rect {
          fill: #007aff;
        }
      }
    `,
    },
});
//# sourceMappingURL=index.js.map