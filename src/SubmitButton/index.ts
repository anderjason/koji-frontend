import { Color } from "@anderjason/color";
import { Observable, ObservableBase, Receipt } from "@anderjason/observable";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { Actor, ConditionalActivator, MultiBinding } from "skytree";
import { ThisOrParentElement } from "..";
import { LoadingIndicator } from "../LoadingIndicator";

export type SubmitButtonMode = "ready" | "busy" | "success" | "disabled";

export interface SubmitButtonProps {
  buttonMode: SubmitButtonMode | ObservableBase<SubmitButtonMode>;
  onClick: () => void;
  target: ThisOrParentElement<HTMLButtonElement>;
  text: string | ObservableBase<string>;
}

const checkSvg = `
  <svg height="556" viewBox="0 -46 417.813 417" width="556" xmlns="http://www.w3.org/2000/svg">
    <path d="M159.988 318.582c-3.988 4.012-9.43 6.25-15.082 6.25s-11.094-2.238-15.082-6.25L9.375 198.113c-12.5-12.5-12.5-32.77 0-45.246l15.082-15.086c12.504-12.5 32.75-12.5 45.25 0l75.2 75.203L348.104 9.781c12.504-12.5 32.77-12.5 45.25 0l15.082 15.086c12.5 12.5 12.5 32.766 0 45.246zm0 0" fill="currentColor" />
  </svg>
`;

export class SubmitButton extends Actor<SubmitButtonProps> {
  private _text: ObservableBase<string>;
  private _buttonMode: ObservableBase<SubmitButtonMode>;

  constructor(props: SubmitButtonProps) {
    super(props);

    this._text = Observable.givenValueOrObservable(this.props.text);
    this._buttonMode = Observable.givenValueOrObservable(this.props.buttonMode);
  }

  onActivate() {
    let button: HTMLButtonElement;

    switch (this.props.target.type) {
      case "thisElement":
        button = this.props.target.element;
        break;
      case "parentElement":
        button = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "button",
            parentElement: this.props.target.parentElement,
          })
        ).element;
        break;
      default:
        throw new Error("An element is required (this or parent)");
    }

    const onClick = () => {
      if (this._buttonMode.value !== "ready") {
        return;
      }

      this.props.onClick();
    };

    button.type = "button";
    button.classList.add(ButtonStyle.toCombinedClassName());
    button.classList.add("kft-control");
    button.addEventListener("click", onClick);

    this.cancelOnDeactivate(
      new Receipt(() => {
        button.removeEventListener("click", onClick);
      })
    );

    const textElement = document.createElement("span");
    textElement.className = "text";
    button.appendChild(textElement);

    this.cancelOnDeactivate(
      this._text.didChange.subscribe((text) => {
        if (text == null) {
          textElement.innerHTML = "";
        } else {
          textElement.innerHTML = text;
        }
      }, true)
    );

    const loadingWrapper = document.createElement("div");
    loadingWrapper.className = "loading";
    button.appendChild(loadingWrapper);

    const completeIcon = document.createElement("div");
    completeIcon.className = "complete";
    completeIcon.innerHTML = checkSvg;
    button.appendChild(completeIcon);

    const appearanceBinding = this.addActor(
      MultiBinding.givenAnyChange([])
    );

    this.cancelOnDeactivate(
      this._buttonMode.didChange.subscribe(() => {
        const mode = this._buttonMode.value;
        
        if (mode == null) {
          return;
        }

        let className: string;
        switch (mode) {
          case "ready":
            className = ButtonStyle.toCombinedClassName();
            button.disabled = false;
            break;
          case "busy":
            className = ButtonStyle.toCombinedClassName("isTextHidden");
            button.disabled = true;
            break;
          case "success":
            className = ButtonStyle.toCombinedClassName([
              "isTextHidden",
              "isSuccess",
            ]);
            button.disabled = true;
            break;
          case "disabled":
            className = ButtonStyle.toCombinedClassName("isDisabled");
            button.disabled = true;
            button.style.background = "#00000022";
            break;
        }

        button.className = `kft-control ${className}`;
      }, true)
    );

    this.addActor(
      new ConditionalActivator({
        input: this._buttonMode,
        fn: (mode) => mode === "busy",
        actor: new LoadingIndicator({
          parentElement: loadingWrapper,
          color: Color.givenHexString("#FFFFFF"),
        }),
      })
    );
  }
}

const ButtonStyle = ElementStyle.givenDefinition({
  elementDescription: "Button",
  css: `
    align-items: center;
    background: #007AFF;
    border-radius: 10px;
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    display: flex;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    grid-area: pay;
    line-height: 25px;
    letter-spacing: 0.02em;
    justify-content: center;
    margin-bottom: -2px;
    margin-left: -2px;
    margin-right: -2px;
    outline: none;
    padding: 1em 0;
    position: relative;
    user-select: none;
    text-align: center;
    transition: 0.2s ease transform, 0.2s ease background;
    width: calc(100% + 4px);
    -webkit-tap-highlight-color: transparent;

    &:active:enabled {
      transform: scale(0.98);
      outline: none;
    }

    .loading {
      align-items: center;
      bottom: 0;
      display: flex;
      justify-content: center;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    .complete {
      align-items: center;
      bottom: 0;
      display: flex;
      justify-content: center;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      transform: scale(0.3);

      svg {
        height: 40px;
        width: 40px;
      }
    }
  `,
  modifiers: {
    isTextHidden: `
      .text {
        opacity: 0;
      }
    `,
    isSuccess: `
      .text {
        opacity: 0;
      }

      .complete {
        transition: 0.3s ease all;
        opacity: 1;
        transform: scale(0.6);
      }
    `,
    isDisabled: `
      background: #00000022;
      cursor: auto;

      .text {
        color: #2D2F3055;
      }
    `,
  },
});
