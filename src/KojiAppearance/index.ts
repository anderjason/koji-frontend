import { FontStyle, Preload } from "@anderjason/web/dist/Preload";

export class KojiAppearance {
  static readonly fontStyles = new Map<string, FontStyle>();

  static preloadFonts() {
    for (let style of KojiAppearance.fontStyles.values()) {
      Preload.instance.addFont(style);
    }
  }
}