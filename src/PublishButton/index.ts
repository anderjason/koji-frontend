import { Actor, DelayActivator, ExclusiveActivator } from "skytree";
import { ElementStyle } from "@anderjason/web";
import { KojiTools } from "../KojiTools";
import { Observable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import { Debounce, Duration } from "@anderjason/time";

export interface PublishButtonProps {
  parentElement: HTMLElement;
  onClick: () => string;
}

const svgIcon = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>`;

export class PublishButton extends Actor<PublishButtonProps> {
  onActivate() {
    const error = Observable.ofEmpty<string>(Observable.isStrictEqual);
    const clearErrorLater = new Debounce({
      duration: Duration.givenSeconds(6),
      fn: () => {
        error.setValue(undefined);
      }
    });

    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    const button = this.addActor(
      ButtonStyle.toManagedElement({
        tagName: "button",
        parentElement: wrapper.element,
        innerHTML: svgIcon,
      })
    );
    button.element.type = "button";

    this.cancelOnDeactivate(
      error.didChange.subscribe(str => {
        button.setModifier("hasError", !StringUtil.stringIsEmpty(str));
      }, true)
    );
    
    this.addActor(
      new ExclusiveActivator({
        input: error,
        fn: (str) => {
          if (StringUtil.stringIsEmpty(str)) {
            return undefined;
          }

          return ErrorStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
            innerHTML: str,
            transitionIn: self => {
              self.setModifier("isVisible", true);
            },
            transitionOut: async self => {
              self.setModifier("isVisible", false);
              await Duration.givenSeconds(0.4).toDelay();
            }
          });
        },
      })
    );

    this.cancelOnDeactivate(
      button.addManagedEventListener("click", () => {
        let validationMessage: string = undefined;

        if (this.props.onClick != null) {
          validationMessage = this.props.onClick();
        }

        if (StringUtil.stringIsEmpty(validationMessage)) {
          error.setValue(undefined);
          clearErrorLater.clear();

          KojiTools.instance.instantRemixing.finish();
        } else {
          error.setValue(validationMessage);
          clearErrorLater.invoke();
        }
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 80px;
  `
});

const ButtonStyle = ElementStyle.givenDefinition({
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

const ErrorStyle = ElementStyle.givenDefinition({
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
