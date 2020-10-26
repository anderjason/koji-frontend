import { Color, ColorGradient } from "@anderjason/color";
import { Rotation } from "@anderjason/geometry";
import { FontStyle, Preload } from "@anderjason/web/dist/Preload";

export interface KojiColorTheme {
  type: "color";
  color: Color;
}

export interface KojiGradientTheme {
  type: "gradient";
  gradient: ColorGradient;
  angle: Rotation;
}

export type KojiTheme = KojiColorTheme | KojiGradientTheme;

export class KojiAppearance {
  static readonly fontStyles = new Map<string, FontStyle>();
  static readonly themes = new Map<string, KojiTheme>();

  static preloadFonts() {
    for (let style of KojiAppearance.fontStyles.values()) {
      Preload.instance.addFont(style);
    }
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

KojiAppearance.themes.set("kojiBlue", {
  type: "color",
  color: Color.givenHexString("#007AFF"),
});

KojiAppearance.themes.set("white", {
  type: "color",
  color: Color.givenHexString("#FFFFFF"),
});

KojiAppearance.themes.set("gray4", {
  type: "color",
  color: Color.givenHexString("#BDBDBD"),
});

KojiAppearance.themes.set("gray5", {
  type: "color",
  color: Color.givenHexString("#E0E0E0"),
});

KojiAppearance.themes.set("gray6", {
  type: "color",
  color: Color.givenHexString("#F2F2F2"),
});

KojiAppearance.themes.set("kojiBlack", {
  type: "color",
  color: Color.givenHexString("#2D2F30"),
});

KojiAppearance.themes.set("red", {
  type: "color",
  color: Color.givenHexString("#EB5757"),
});

KojiAppearance.themes.set("orange", {
  type: "color",
  color: Color.givenHexString("#F2994A"),
});

KojiAppearance.themes.set("mustard", {
  type: "color",
  color: Color.givenHexString("#FCBA04"),
});

KojiAppearance.themes.set("green2", {
  type: "color",
  color: Color.givenHexString("#27AE60"),
});

KojiAppearance.themes.set("blue2", {
  type: "color",
  color: Color.givenHexString("#2D9CDB"),
});

KojiAppearance.themes.set("purple2", {
  type: "color",
  color: Color.givenHexString("#BB6BD9"),
});

KojiAppearance.themes.set("gradient1", {
  type: "gradient",
  gradient: ColorGradient.givenSteps([
    Color.givenHexString("#FFF123"),
    Color.givenHexString("#FF91A5"),
    Color.givenHexString("#CA77F2"),
    Color.givenHexString("#95CCFF"),
  ]),
  angle: Rotation.givenDegrees(91.65),
});

KojiAppearance.themes.set("gradient2", {
  type: "gradient",
  gradient: ColorGradient.givenSteps([
    Color.givenHexString("#BDAFE2"),
    Color.givenHexString("#C3F5DC"),
  ]),
  angle: Rotation.givenDegrees(91.65),
});
