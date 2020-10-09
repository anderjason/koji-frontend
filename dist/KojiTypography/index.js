"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiTypography = void 0;
const Preload_1 = require("@anderjason/web/dist/Preload");
class KojiTypography {
    static preloadFonts() {
        for (let style of KojiTypography.fontStyles.values()) {
            Preload_1.Preload.instance.addFont(style);
        }
    }
}
exports.KojiTypography = KojiTypography;
KojiTypography.fontStyles = new Map();
KojiTypography.fontStyles.set("ptSansBold", {
    fontFamily: "PT Sans",
    weight: 700,
    url: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap",
});
KojiTypography.fontStyles.set("sourceSansSemibold", {
    fontFamily: "Source Sans Pro",
    weight: 600,
    url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@600&display=swap",
});
//# sourceMappingURL=index.js.map