"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitButton = void 0;
const color_1 = require("@anderjason/color");
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
const LoadingIndicator_1 = require("../LoadingIndicator");
const checkSvg = `
  <svg height="556" viewBox="0 -46 417.813 417" width="556" xmlns="http://www.w3.org/2000/svg">
    <path d="M159.988 318.582c-3.988 4.012-9.43 6.25-15.082 6.25s-11.094-2.238-15.082-6.25L9.375 198.113c-12.5-12.5-12.5-32.77 0-45.246l15.082-15.086c12.504-12.5 32.75-12.5 45.25 0l75.2 75.203L348.104 9.781c12.504-12.5 32.77-12.5 45.25 0l15.082 15.086c12.5 12.5 12.5 32.766 0 45.246zm0 0" fill="currentColor" />
  </svg>
`;
class SubmitButton extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._text = observable_1.Observable.givenValueOrObservable(this.props.text);
        this._buttonMode = observable_1.Observable.givenValueOrObservable(this.props.buttonMode);
        this._theme = observable_1.Observable.givenValueOrObservable(this.props.theme);
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
        const onClick = () => {
            if (this._buttonMode.value !== "ready") {
                return;
            }
            this.props.onClick();
        };
        button.classList.add(ButtonStyle.toCombinedClassName());
        button.classList.add("kft-control");
        button.addEventListener("click", onClick);
        button.type = "button";
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            button.removeEventListener("click", onClick);
        }));
        const textElement = document.createElement("span");
        textElement.className = "text";
        button.appendChild(textElement);
        this.cancelOnDeactivate(this._text.didChange.subscribe((text) => {
            if (text == null) {
                textElement.innerHTML = "";
            }
            else {
                textElement.innerHTML = text;
            }
        }, true));
        const loadingWrapper = document.createElement("div");
        loadingWrapper.className = "loading";
        button.appendChild(loadingWrapper);
        const completeIcon = document.createElement("div");
        completeIcon.className = "complete";
        completeIcon.innerHTML = checkSvg;
        button.appendChild(completeIcon);
        const appearanceBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            this._theme,
            this._buttonMode
        ]));
        this.cancelOnDeactivate(this._theme.didChange.subscribe((theme) => {
            if (theme == null) {
                return;
            }
            theme.applyBackgroundStyle(button);
        }, true));
        this.cancelOnDeactivate(appearanceBinding.didInvalidate.subscribe(() => {
            const mode = this._buttonMode.value;
            const theme = this._theme.value || KojiAppearance_1.KojiAppearance.themes.get("kojiBlue");
            if (mode == null) {
                return;
            }
            let className;
            switch (mode) {
                case "ready":
                    className = ButtonStyle.toCombinedClassName();
                    button.disabled = false;
                    theme.applyBackgroundStyle(button);
                    break;
                case "busy":
                    className = ButtonStyle.toCombinedClassName("isTextHidden");
                    button.disabled = true;
                    theme.applyBackgroundStyle(button);
                    break;
                case "success":
                    className = ButtonStyle.toCombinedClassName([
                        "isTextHidden",
                        "isSuccess",
                    ]);
                    button.disabled = true;
                    theme.applyBackgroundStyle(button);
                    break;
                case "disabled":
                    className = ButtonStyle.toCombinedClassName("isDisabled");
                    button.disabled = true;
                    button.style.background = "#00000022";
                    break;
            }
            button.className = `kft-control ${className}`;
        }, true));
        this.addActor(new skytree_1.ConditionalActivator({
            input: this._buttonMode,
            fn: mode => mode === "busy",
            actor: new LoadingIndicator_1.LoadingIndicator({
                parentElement: loadingWrapper,
                color: color_1.Color.givenHexString("#FFFFFF"),
            })
        }));
    }
}
exports.SubmitButton = SubmitButton;
const ButtonStyle = web_1.ElementStyle.givenDefinition({
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
    margin-left: -2px;
    margin-right: -2px;
    outline: none;
    padding: 1em 0;
    position: relative;
    text-align: center;
    transition: 0.2s ease transform, 0.2s ease background;
    width: calc(100% + 4px);

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
//# sourceMappingURL=index.js.map