import { Actor } from "skytree";
import { Observable } from "@anderjason/observable";
import { Color } from "@anderjason/color";
export interface LoadingIndicatorProps {
    parentElement: HTMLElement | Observable<HTMLElement>;
    color: Color | Observable<Color>;
}
export declare class LoadingIndicator extends Actor<LoadingIndicatorProps> {
    private _svg;
    onActivate(): void;
}
