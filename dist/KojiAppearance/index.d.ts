import { Color, ColorGradient } from "@anderjason/color";
import { Rotation } from "@anderjason/geometry";
import { FontStyle } from "@anderjason/web/dist/Preload";
export interface KojiColorDefinition {
    type: "color";
    color: Color;
}
export interface KojiGradientDefinition {
    type: "gradient";
    gradient: ColorGradient;
    angle: Rotation;
}
export declare type KojiThemeDefinition = KojiColorDefinition | KojiGradientDefinition;
export declare type KojiThemeStyleType = "background" | "text";
export declare class KojiTheme {
    readonly key: string;
    readonly definition: KojiThemeDefinition;
    constructor(key: string, definition: KojiThemeDefinition);
    toHighContrastColor(): Color;
    toColor(): Color;
    toStyle(styleType: KojiThemeStyleType): any;
    applyStyle(element: HTMLElement, styleType: KojiThemeStyleType): void;
    private toBackgroundStyle;
    private toTextStyle;
}
export declare class KojiAppearance {
    static readonly fontStyles: Map<string, FontStyle>;
    static readonly themes: Map<string, KojiTheme>;
    static preloadFonts(): void;
    static toColor(themeKey: string): Color;
}
