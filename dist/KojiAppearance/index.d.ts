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
export declare class KojiTheme {
    readonly key: string;
    readonly definition: KojiThemeDefinition;
    constructor(key: string, definition: KojiThemeDefinition);
    toHighContrastColor(): Color;
    toColor(): Color;
    applyBackgroundStyle(element: HTMLElement): void;
    applyTextStyle(element: HTMLElement): void;
    toBackgroundStyle(): any;
    toTextStyle(): any;
}
export declare class KojiAppearance {
    static readonly fontStyles: Map<string, FontStyle>;
    static readonly themes: Map<string, KojiTheme>;
    static preloadFonts(): void;
    static toColor(themeKey: string): Color;
}
