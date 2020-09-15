import { ManagedObject } from "skytree";
import { Duration } from "@anderjason/time";
import { Color } from "@anderjason/color";
import { ElementStyle } from "@anderjason/web";
export interface LoadingIndicatorProps {
    parentElement: HTMLElement;
    waitDuration?: Duration;
    color?: Color;
}
export declare class LoadingIndicator extends ManagedObject<LoadingIndicatorProps> {
    onActivate(): void;
}
export declare const LoaderStyle: ElementStyle;
