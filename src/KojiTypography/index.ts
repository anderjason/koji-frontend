import { FontStyle, Preload } from "@anderjason/web/dist/Preload";

export class KojiTypography {
  static readonly fontStyles = new Map<string, FontStyle>();

  static preloadFonts() {
    for (let style of KojiTypography.fontStyles.values()) {
      Preload.instance.addFont(style);
    }
  }
}

KojiTypography.fontStyles.set("ptSansBold", {
  fontFamily: "PT Sans",
  weight: 700,
  url: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap",
});

KojiTypography.fontStyles.set("sourceSansSemibold", {
  fontFamily: "Source Sans Pro",
  weight: 600,
  url:
    "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@600&display=swap",
});
