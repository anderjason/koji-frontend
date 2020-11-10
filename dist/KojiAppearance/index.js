"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiAppearance = void 0;
const color_1 = require("@anderjason/color");
const geometry_1 = require("@anderjason/geometry");
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
KojiAppearance.themes = new Map();
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
KojiAppearance.themes.set("kojiBlue", {
    key: "kojiBlue",
    type: "color",
    color: color_1.Color.givenHexString("#007AFF"),
});
KojiAppearance.themes.set("white", {
    key: "white",
    type: "color",
    color: color_1.Color.givenHexString("#FFFFFF"),
});
KojiAppearance.themes.set("gray4", {
    key: "gray4",
    type: "color",
    color: color_1.Color.givenHexString("#BDBDBD"),
});
KojiAppearance.themes.set("gray5", {
    key: "gray5",
    type: "color",
    color: color_1.Color.givenHexString("#E0E0E0"),
});
KojiAppearance.themes.set("gray6", {
    key: "gray6",
    type: "color",
    color: color_1.Color.givenHexString("#F2F2F2"),
});
KojiAppearance.themes.set("kojiBlack", {
    key: "kojiBlack",
    type: "color",
    color: color_1.Color.givenHexString("#2D2F30"),
});
KojiAppearance.themes.set("red", {
    key: "red",
    type: "color",
    color: color_1.Color.givenHexString("#EB5757"),
});
KojiAppearance.themes.set("orange", {
    key: "orange",
    type: "color",
    color: color_1.Color.givenHexString("#F2994A"),
});
KojiAppearance.themes.set("mustard", {
    key: "mustard",
    type: "color",
    color: color_1.Color.givenHexString("#FCBA04"),
});
KojiAppearance.themes.set("green2", {
    key: "green2",
    type: "color",
    color: color_1.Color.givenHexString("#27AE60"),
});
KojiAppearance.themes.set("blue2", {
    key: "blue2",
    type: "color",
    color: color_1.Color.givenHexString("#2D9CDB"),
});
KojiAppearance.themes.set("purple2", {
    key: "purple2",
    type: "color",
    color: color_1.Color.givenHexString("#BB6BD9"),
});
KojiAppearance.themes.set("gradient1", {
    key: "gradient1",
    type: "gradient",
    gradient: color_1.ColorGradient.givenSteps([
        color_1.Color.givenHexString("#FFF123"),
        color_1.Color.givenHexString("#FF91A5"),
        color_1.Color.givenHexString("#CA77F2"),
        color_1.Color.givenHexString("#95CCFF"),
    ]),
    angle: geometry_1.Rotation.givenDegrees(91.65),
});
KojiAppearance.themes.set("gradient2", {
    key: "gradient2",
    type: "gradient",
    gradient: color_1.ColorGradient.givenSteps([
        color_1.Color.givenHexString("#BDAFE2"),
        color_1.Color.givenHexString("#C3F5DC"),
    ]),
    angle: geometry_1.Rotation.givenDegrees(91.65),
});
//# sourceMappingURL=index.js.map