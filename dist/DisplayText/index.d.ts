import { Color } from "@anderjason/color";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export declare type DisplayTextType = "title";
export interface DisplayTextProps {
    parentElement: HTMLElement;
    displayType: DisplayTextType;
    text: string | Observable<string>;
    color?: Color | Observable<Color>;
}
export declare class DisplayText extends Actor<DisplayTextProps> {
    constructor(props: DisplayTextProps);
    onActivate(): void;
}
