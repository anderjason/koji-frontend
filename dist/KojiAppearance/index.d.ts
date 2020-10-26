import { Color, ColorGradient } from "@anderjason/color";
import { Rotation } from "@anderjason/geometry";
import { FontStyle } from "@anderjason/web/dist/Preload";
export interface KojiColorTheme {
    type: "color";
    color: Color;
}
export interface KojiGradientTheme {
    type: "gradient";
    gradient: ColorGradient;
    angle: Rotation;
}
export declare type KojiTheme = KojiColorTheme | KojiGradientTheme;
export declare class KojiAppearance {
    static readonly fontStyles: Map<string, FontStyle>;
    static readonly themes: Map<string, KojiTheme>;
    static preloadFonts(): void;
}
