"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiAppearance = void 0;
const Preload_1 = require("@anderjason/web/dist/Preload");
class KojiAppearance {
    static preloadFonts() {
        for (let style of KojiAppearance.fontStyles.values()) {
            Preload_1.Preload.instance.addFont(style);
        }
    }
}
exports.KojiAppearance = KojiAppearance;
KojiAppearance.fontStyles = new Map();
KojiAppearance.fontStyles.set("ptSansBold", {
    fontFamily: "PT Sans",
    weight: 700,
    url: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap",
});
KojiAppearance.fontStyles.set("sourceSansSemibold", {
    fontFamily: "Source Sans Pro",
    weight: 600,
    url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@600&display=swap",
});
KojiAppearance.fontStyles.set("sourceSansRegular", {
    fontFamily: "Source Sans Pro",
    weight: 400,
    url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400&display=swap",
});
//# sourceMappingURL=index.js.map