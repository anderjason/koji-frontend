import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { ElementStyle, Pointer } from "@anderjason/web";
import { Actor } from "skytree";
import { KojiAppearance, KojiTheme } from "../KojiAppearance";

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

export interface ThemeToolbarProps {
  parentElement: HTMLElement | Observable<HTMLElement>;

  output?: Observable<KojiTheme>;
  themes?: KojiTheme[];
}

export class ThemeToolbar extends Actor<ThemeToolbarProps> {
  readonly output: Observable<KojiTheme>;

  constructor(props: ThemeToolbarProps) {
    super(props);

    this.output =
      this.props.output ||
      Observable.ofEmpty<KojiTheme>(Observable.isStrictEqual);
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
        transitionIn: () => {
          wrapper.setModifier("isVisible", true);
        },
        transitionOut: async () => {
          wrapper.setModifier("isVisible", false);
          await Duration.givenSeconds(0.3).toDelay();
        },
      })
    );

    const themes: KojiTheme[] =
      this.props.themes ||
      defaultThemeKeys.map((key) => KojiAppearance.themes.get(key));

    themes.forEach((theme) => {
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
        this.output.setValue(theme);
      });
      wrapper.element.appendChild(optionButton);

      this.cancelOnDeactivate(Pointer.instance.addTarget(optionButton));

      this.cancelOnDeactivate(
        this.output.didChange.subscribe((selectedTheme) => {
          const isSelected = selectedTheme?.key == theme.key;

          optionButton.className = OptionStyle.toCombinedClassName(
            isSelected ? "isSelected" : undefined
          );
        }, true)
      );
    });
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
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

const OptionStyle = ElementStyle.givenDefinition({
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
