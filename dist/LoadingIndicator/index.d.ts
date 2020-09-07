import { ManagedObject } from "skytree";
import { Duration } from "@anderjason/time";
import { Color } from "@anderjason/color";
import { ElementStyle } from "@anderjason/web";
export interface LoadingIndicatorOptions {
    waitDuration?: Duration;
    color?: Color;
}
export declare class LoadingIndicator extends ManagedObject {
    static ofDocument(options?: LoadingIndicatorOptions): LoadingIndicator;
    static givenParent(parentElement: HTMLElement, options?: LoadingIndicatorOptions): LoadingIndicator;
    private _parentElement;
    private _waitDuration;
    private _color;
    private constructor();
    initManagedObject(): void;
}
export declare const LoaderStyle: ElementStyle;
