import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { ValuePath } from "@anderjason/util";
import { ElementStyle, Pointer } from "@anderjason/web";
import { Actor } from "skytree";
import { Koji } from "../Koji";
import { KojiAppearance } from "../KojiAppearance";

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

export interface ThemeToolbarDefinition {
  parentElement: HTMLElement | Observable<HTMLElement>;
  vccPath: ValuePath;

  themeKeys?: string[];
}

export class ThemeToolbar extends Actor<ThemeToolbarDefinition> {
  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
        transitionIn: () => {
          wrapper.addModifier("isVisible");
        },
        transitionOut: async () => {
          wrapper.removeModifier("isVisible");
          await Duration.givenSeconds(0.3).toDelay();
        },
      })
    );

    const themeKeys = this.props.themeKeys || defaultThemeKeys;

    themeKeys.forEach((key) => {
      const theme = KojiAppearance.themes.get(key);
      if (theme == null) {
        console.warn(`Could not find KojiAppearance theme '${key}'`);
        return;
      }

      const optionButton = OptionStyle.toDomElement("button");
      optionButton.type = "button";

      const icon = document.createElement("div");
      icon.className = "icon";

      if (theme.type === "color") {
        icon.style.background = theme.color.toHexString();
      } else {
        icon.style.background = theme.gradient.toLinearGradientString(
          `${theme.angle.toDegrees()}deg`
        );
      }

      optionButton.appendChild(icon);

      optionButton.addEventListener("click", () => {
        Koji.instance.vccData.update(this.props.vccPath, key);
      });
      wrapper.element.appendChild(optionButton);

      this.cancelOnDeactivate(Pointer.instance.addTarget(optionButton));

      this.cancelOnDeactivate(
        Koji.instance.vccData.subscribe(
          this.props.vccPath,
          (selectedKey) => {
            const isSelected = selectedKey == key;

            optionButton.className = OptionStyle.toCombinedClassName(
              isSelected ? "isSelected" : undefined
            );
          },
          true
        )
      );
    });
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
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
  `,
  modifiers: {
    isVisible: `
      opacity: 1;
    `,
  },
});

const OptionStyle = ElementStyle.givenDefinition({
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
      background: #888;
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
