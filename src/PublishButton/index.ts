import { Actor, ExclusiveActivator } from "skytree";
import { ElementStyle } from "@anderjason/web";
import { Observable, ObservableBase } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { LoadingIndicator } from "..";
import { Color } from "@anderjason/color";

export interface PublishButtonReadyMode {
  type: "ready";
}

export interface PublishButtonBusyMode {
  type: "busy";
}

export interface PublishButtonErrorMode {
  type: "error";
  errorText: string;
}

export type PublishButtonMode = PublishButtonReadyMode | PublishButtonBusyMode | PublishButtonErrorMode;

export interface PublishButtonProps {
  parentElement: HTMLElement;
  onClick: () => void;
  mode: PublishButtonMode | ObservableBase<PublishButtonMode>;
}

const svgIcon = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>`;

export class PublishButton extends Actor<PublishButtonProps> {
  private _mode: ObservableBase<PublishButtonMode>;

  constructor(props: PublishButtonProps) {
    super(props);

    this._mode = Observable.givenValueOrObservable(this.props.mode || { type: "ready" });
  }

  onActivate() {
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
      })
    );
    button.element.type = "button";

    this.addActor(
      new ExclusiveActivator({
        input: this._mode,
        fn: mode => {
          switch (mode.type) {
            case "busy":
              return new LoadingIndicator({
                parentElement: button.element,
                color: Color.givenHexString("#FFFFFF")
              })
            case "ready":
              return ArrowStyle.toManagedElement({
                tagName: "div",
                parentElement: button.element,
                innerHTML: svgIcon
              });
            case "error":
              return ArrowStyle.toManagedElement({
                tagName: "div",
                parentElement: button.element,
                innerHTML: svgIcon
              });
            default:
              break;
          }
        }
      })
    )

    this.cancelOnDeactivate(
      this._mode.didChange.subscribe(mode => {
        button.setModifier("isBusy", mode.type === "busy");
        button.setModifier("hasError", mode.type === "error");
      }, true)
    );
    
    this.addActor(
      new ExclusiveActivator({
        input: this._mode,
        fn: (mode) => {
          if (mode.type != "error") {
            return undefined;
          }

          return ErrorStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
            innerHTML: mode.errorText,
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
        if (this._mode.value.type === "busy") {
          return;
        }

        if (this.props.onClick != null) {
          this.props.onClick();
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
    transition: 0.15s ease transform, 0.3s ease background-color;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.9);
    }
  `,
  modifiers: {
    isBusy: `
      pointer-events: none;
    `,
    hasError: `
      background-color: rgb(22, 72, 142);

      svg {
        opacity: 0.5;
      }
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

const ArrowStyle = ElementStyle.givenDefinition({
  elementDescription: "Arrow",
  css: `
    width: 32px;
    height: 32px;

    svg {
      width: 32px;
      height: 32px;
      color: white;
      fill: white;
      transition: 0.3s ease opacity;
    }
  `
});
