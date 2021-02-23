import { FontStyle, Preload } from "@anderjason/web/dist/Preload";

export class KojiAppearance {
  static readonly fontStyles = new Map<string, FontStyle>();

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
