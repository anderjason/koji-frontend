"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationPrompt = void 0;
const skytree_1 = require("skytree");
const web_1 = require("@anderjason/web");
const time_1 = require("@anderjason/time");
const __1 = require("..");
class ConfirmationPrompt extends skytree_1.Actor {
    constructor(props) {
        super(props);
        __1.KojiAppearance.preloadFonts();
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        const overlay = this.addActor(OverlayStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
            transitionIn: () => {
                overlay.setModifier("isVisible", true);
            },
            transitionOut: async () => {
                overlay.setModifier("isVisible", false);
                await time_1.Duration.givenSeconds(0.3).toDelay();
            },
        }));
        this.cancelOnDeactivate(overlay.addManagedEventListener("click", () => {
            console.log("click");
            this.props.onCancel();
        }));
        const modalContainer = this.addActor(ModalContainerStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        const card = this.addActor(CardStyle.toManagedElement({
            tagName: "div",
            parentElement: modalContainer.element,
            transitionIn: () => {
                card.setModifier("isVisible", true);
            },
            transitionOut: async () => {
                card.setModifier("isVisible", false);
                await time_1.Duration.givenSeconds(0.3).toDelay();
            },
        }));
        const messageArea = this.addActor(MessageAreaStyle.toManagedElement({
            tagName: "div",
            parentElement: card.element,
        }));
        const title = document.createElement("div");
        title.className = "title";
        title.innerHTML = this.props.title;
        messageArea.element.appendChild(title);
        const description = document.createElement("div");
        description.className = "description";
        description.innerHTML = this.props.description;
        messageArea.element.appendChild(description);
        const confirmButton = this.addActor(ButtonStyle.toManagedElement({
            tagName: "button",
            parentElement: card.element,
        }));
        confirmButton.element.innerHTML = this.props.confirmText;
        confirmButton.setModifier("isDestructive", this.props.isConfirmDestructive);
        this.cancelOnDeactivate(confirmButton.addManagedEventListener("click", () => {
            this.props.onConfirm();
        }));
        const cancelButton = this.addActor(ButtonStyle.toManagedElement({
            tagName: "button",
            parentElement: card.element,
        }));
        cancelButton.element.innerHTML = this.props.cancelText;
        this.cancelOnDeactivate(cancelButton.addManagedEventListener("click", () => {
            this.props.onCancel();
        }));
    }
}
exports.ConfirmationPrompt = ConfirmationPrompt;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
  `,
});
const OverlayStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Overlay",
    css: `
    background-color: #000;
    bottom: 0px;
    left: 0px;
    opacity: 0;
    position: absolute;
    pointer-events: auto;
    right: 0px;
    top: 0px;    
    z-index: 1;
  `,
    modifiers: {
        isVisible: `
      transition: 0.3s ease opacity;
      opacity: 0.4;
    `,
    },
});
const ModalContainerStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "ModalContainer",
    css: `
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    margin: auto;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  `,
});
const CardStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Card",
    css: `
    background-color: #FFF;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 18px 6px;
    color: #111111;
    display: flex;
    flex-direction: column;
    max-width: 300px;
    min-width: 300px;
    opacity: 0;
    pointer-events: auto;
    transform: scale(0.95);
    user-select: none;
    width: 100%;
    z-index: 9999;
  `,
    modifiers: {
        isVisible: `
      transition: 0.3s ease opacity, 0.3s ease transform;
      opacity: 1;
      transform: scale(1);
    `,
    },
});
const MessageAreaStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "MessageArea",
    css: `
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: "Source Sans Pro", sans-serif;
    height: 100%;
    justify-content: center;
    letter-spacing: 0.02em;
    line-height: 1.25;
    padding: 24px 18px;
    width: 100%;

    .title {
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .description {
      width: 100%;
      text-align: center;
      font-size: 14px;
    }
  `,
});
const ButtonStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Button",
    css: `
    appearance: none;
    background: none;
    border: none;
    border-top: 1px solid rgb(244, 244, 244);
    color: rgb(0, 122, 255);
    cursor: pointer;
    font-family: inherit;
    font-size: 16px;
    line-height: 1;
    outline: none;
    padding: 16px;
    text-align: center;
    user-select: none;
    width: 100%;

    &:last-of-type {
      border-radius: 0 0 12px 12px;
    }
    &:active, &:focus {
      background: #FAFAFA;
    }
  `,
    modifiers: {
        isDestructive: `
      color: rgb(252, 13, 27);
      font-weight: bold;
    `,
    },
});
//# sourceMappingURL=index.js.map