"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToolbar = void 0;
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiAppearance_1 = require("../KojiAppearance");
const defaultThemeKeys = [
    "kojiBlack",
    "red",
    "orange",
    "mustard",
    "green2",
    "blue2",
    "purple2",
    "gradient1",
    "gradient2",
];
class ThemeToolbar extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this.output =
            this.props.output ||
                observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
            transitionIn: () => {
                wrapper.setModifier("isVisible", true);
            },
            transitionOut: async () => {
                wrapper.setModifier("isVisible", false);
                await time_1.Duration.givenSeconds(0.3).toDelay();
            },
        }));
        const themes = this.props.themes ||
            defaultThemeKeys.map((key) => KojiAppearance_1.KojiAppearance.themes.get(key));
        themes.forEach((theme) => {
            const optionButton = OptionStyle.toDomElement("button");
            optionButton.type = "button";
            const icon = document.createElement("div");
            icon.className = "icon";
            theme.applyBackgroundStyle(icon);
            optionButton.appendChild(icon);
            optionButton.addEventListener("click", () => {
                this.output.setValue(theme);
            });
            wrapper.element.appendChild(optionButton);
            this.cancelOnDeactivate(web_1.Pointer.instance.addTarget(optionButton));
            this.cancelOnDeactivate(this.output.didChange.subscribe((selectedTheme) => {
                const isSelected = (selectedTheme === null || selectedTheme === void 0 ? void 0 : selectedTheme.key) == theme.key;
                optionButton.className = OptionStyle.toCombinedClassName(isSelected ? "isSelected" : undefined);
            }, true));
        });
    }
}
exports.ThemeToolbar = ThemeToolbar;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    display: grid;
    grid-auto-flow: column;
    left: 0;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    top: 60px;
    transition-duration: 0.3s;
    transition-property: opacity, transform;
    transition-timing-function: ease;
    width: 100%;
    z-index: 1000;
  `,
    modifiers: {
        isVisible: `
      opacity: 1;
    `,
    },
});
const OptionStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Option",
    css: `
    align-items: center;
    appearance: none;
    background: transparent;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    outline: none;
    border: none;
    padding: 0 0 8px 0;
    transition: 0.05s ease transform;

    &:active {
      transform: scale(0.92);
    }
    
    .icon {
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
      background-color: #888;
      border-radius: 50%;
      border: 2px solid white;
      box-sizing: border-box;
      height: 20px;
      width: 20px;
    }
  `,
    modifiers: {
        isSelected: `
      .icon {
        border-color: #2d9cdb;
      }
    `,
    },
});
//# sourceMappingURL=index.js.map