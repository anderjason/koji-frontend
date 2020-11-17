import { Color, ColorGradient } from "@anderjason/color";
import { Rotation } from "@anderjason/geometry";
import { Percent } from "@anderjason/util";
import { FontStyle, Preload } from "@anderjason/web/dist/Preload";

export interface KojiColorDefinition {
  type: "color";
  color: Color;
}

export interface KojiGradientDefinition {
  type: "gradient";
  gradient: ColorGradient;
  angle: Rotation;
}

export type KojiThemeDefinition = KojiColorDefinition | KojiGradientDefinition;

export class KojiTheme {
  readonly key: string;
  readonly definition: KojiThemeDefinition;

  constructor(key: string, definition: KojiThemeDefinition) {
    this.key = key;
    this.definition = definition;
  }

  toHighContrastColor(): Color {
    return this.toColor().toHighContrastColor();
  }

  toColor(): Color {
    switch (this.definition.type) {
      case "color":
        return this.definition.color;
      case "gradient":
        return this.definition.gradient.toHclInterpolatedColor(
          Percent.ofHalf()
        );
      default:
        throw new Error("Unsupported theme type");
    }
  }

  applyBackgroundStyle(element: HTMLElement): void {
    let style = this.toBackgroundStyle();
    Object.keys(style).forEach((key) => {
      element.style.setProperty(key, style[key]);
    });
  }

  applyTextStyle(element: HTMLElement): void {
    let style = this.toTextStyle();
    Object.keys(style).forEach((key) => {
      element.style.setProperty(key, style[key]);
    });
  }

  toBackgroundStyle(): any {
    switch (this.definition.type) {
      case "color":
        const { color } = this.definition;
        return {
          background: color.toHexString(),
        };
      case "gradient":
        const { gradient, angle } = this.definition;
        return {
          background: gradient
            .withHclStepCount(5)
            .toLinearGradientString(`${angle.toDegrees()}deg`),
        };
      default:
        throw new Error("Unsupported theme definition type");
    }
  }

  toTextStyle(): any {
    return {
      color: this.toColor().toHexString(),
    };
  }
}

export class KojiAppearance {
  static readonly fontStyles = new Map<string, FontStyle>();
  static readonly themes = new Map<string, KojiTheme>();

  static preloadFonts() {
    for (let style of KojiAppearance.fontStyles.values()) {
      Preload.instance.addFont(style);
    }
  }

  static toColor(themeKey: string): Color {
    const theme = KojiAppearance.themes.get(themeKey);
    if (theme == null) {
      throw new Error(`Unrecognized theme key '${themeKey}'`);
    }

    return theme.toColor();
  }
}

KojiAppearance.fontStyles.set("ptSansBold", {
  fontFamily: "PT Sans",
  weight: 700,
  url: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap",
});

KojiAppearance.fontStyles.set("sourceSansSemibold", {
  fontFamily: "Source Sans Pro",
  weight: 600,
  url:
    "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@600&display=swap",
});

KojiAppearance.fontStyles.set("sourceSansRegular", {
  fontFamily: "Source Sans Pro",
  weight: 400,
  url:
    "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400&display=swap",
});

KojiAppearance.themes.set(
  "kojiBlue",
  new KojiTheme("kojiBlue", {
    type: "color",
    color: Color.givenHexString("#007AFF"),
  })
);

KojiAppearance.themes.set(
  "white",
  new KojiTheme("white", {
    type: "color",
    color: Color.givenHexString("#FFFFFF"),
  })
);

KojiAppearance.themes.set(
  "gray4",
  new KojiTheme("gray4", {
    type: "color",
    color: Color.givenHexString("#BDBDBD"),
  })
);

KojiAppearance.themes.set(
  "gray5",
  new KojiTheme("gray5", {
    type: "color",
    color: Color.givenHexString("#E0E0E0"),
  })
);

KojiAppearance.themes.set(
  "gray6",
  new KojiTheme("gray6", {
    type: "color",
    color: Color.givenHexString("#F2F2F2"),
  })
);

KojiAppearance.themes.set(
  "kojiBlack",
  new KojiTheme("kojiBlack", {
    type: "color",
    color: Color.givenHexString("#2D2F30"),
  })
);

KojiAppearance.themes.set(
  "red",
  new KojiTheme("red", {
    type: "color",
    color: Color.givenHexString("#EB5757"),
  })
);

KojiAppearance.themes.set(
  "orange",
  new KojiTheme("orange", {
    type: "color",
    color: Color.givenHexString("#F2994A"),
  })
);

KojiAppearance.themes.set(
  "mustard",
  new KojiTheme("mustard", {
    type: "color",
    color: Color.givenHexString("#FCBA04"),
  })
);

KojiAppearance.themes.set(
  "green2",
  new KojiTheme("green2", {
    type: "color",
    color: Color.givenHexString("#27AE60"),
  })
);

KojiAppearance.themes.set(
  "blue2",
  new KojiTheme("blue2", {
    type: "color",
    color: Color.givenHexString("#2D9CDB"),
  })
);

KojiAppearance.themes.set(
  "purple2",
  new KojiTheme("purple2", {
    type: "color",
    color: Color.givenHexString("#BB6BD9"),
  })
);

KojiAppearance.themes.set(
  "gradient1",
  new KojiTheme("gradient1", {
    type: "gradient",
    gradient: ColorGradient.givenSteps([
      Color.givenHexString("#FFF123"),
      Color.givenHexString("#FF91A5"),
      Color.givenHexString("#CA77F2"),
      Color.givenHexString("#95CCFF"),
    ]),
    angle: Rotation.givenDegrees(91.65),
  })
);

KojiAppearance.themes.set(
  "gradient2",
  new KojiTheme("gradient2", {
    type: "gradient",
    gradient: ColorGradient.givenSteps([
      Color.givenHexString("#BDAFE2"),
      Color.givenHexString("#C3F5DC"),
    ]),
    angle: Rotation.givenDegrees(91.65),
  })
);
