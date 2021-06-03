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
//# sourceMappingURL=index.js.map