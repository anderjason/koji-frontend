"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishButton = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const KojiTools_1 = require("../KojiTools");
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const time_1 = require("@anderjason/time");
const svgIcon = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>`;
class PublishButton extends skytree_1.Actor {
    onActivate() {
        const error = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        const clearErrorLater = new time_1.Debounce({
            duration: time_1.Duration.givenSeconds(6),
            fn: () => {
                error.setValue(undefined);
            }
        });
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        const button = this.addActor(ButtonStyle.toManagedElement({
            tagName: "button",
            parentElement: wrapper.element,
            innerHTML: svgIcon,
        }));
        button.element.type = "button";
        this.cancelOnDeactivate(error.didChange.subscribe(str => {
            button.setModifier("hasError", !util_1.StringUtil.stringIsEmpty(str));
        }, true));
        this.addActor(new skytree_1.ExclusiveActivator({
            input: error,
            fn: (str) => {
                if (util_1.StringUtil.stringIsEmpty(str)) {
                    return undefined;
                }
                return ErrorStyle.toManagedElement({
                    tagName: "div",
                    parentElement: wrapper.element,
                    innerHTML: str,
                    transitionIn: self => {
                        self.setModifier("isVisible", true);
                    },
                    transitionOut: async (self) => {
                        self.setModifier("isVisible", false);
                        await time_1.Duration.givenSeconds(0.4).toDelay();
                    }
                });
            },
        }));
        this.cancelOnDeactivate(button.addManagedEventListener("click", () => {
            let validationMessage = undefined;
            if (this.props.onClick != null) {
                validationMessage = this.props.onClick();
            }
            if (util_1.StringUtil.stringIsEmpty(validationMessage)) {
                error.setValue(undefined);
                clearErrorLater.clear();
                KojiTools_1.KojiTools.instance.instantRemixing.finish();
            }
            else {
                error.setValue(validationMessage);
                clearErrorLater.invoke();
            }
        }));
    }
}
exports.PublishButton = PublishButton;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 80px;
  `
});
const ButtonStyle = web_1.ElementStyle.givenDefinition({
    css: `
    appearance: none;
    border: none;
    background-color: rgb(0, 122, 255);
    border-radius: 50%;
    bottom: 16px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    display: flex;
    outline: none;
    position: absolute;
    width: 48px;
    height: 48px;
    right: 16px;
    align-items: center;
    justify-content: center;
    transition: 0.15s ease transform, 0.3s ease opacity;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.9);
    }

    svg {
      width: 32px;
      height: 32px;
      color: white;
      fill: white;
    }
  `,
    modifiers: {
        hasError: `
      opacity: 0.5;
    `
    }
});
const ErrorStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Error",
    css: `
    background-color: rgb(0, 122, 255);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    font-family: Source Sans Pro;
    font-size: 16px;
    font-style: normal;
    font-weight: bold;
    letter-spacing: 0.02em;
    line-height: 20px;
    max-width: calc(100% - 114px);
    opacity: 0;
    padding: 6px 12px;
    position: absolute;
    right: 78px;
    top: 50%;
    transform: translate(10px, -50%);
    transition: all 0.4s ease;
    user-select: none;
    will-change: transform, opacity;
    z-index: 1000;
  `,
    modifiers: {
        isVisible: `
      opacity: 1;
      transform: translate(0, -50%);
    `
    }
});
//# sourceMappingURL=index.js.map