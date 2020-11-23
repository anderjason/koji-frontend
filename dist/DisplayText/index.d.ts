import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { KojiTheme } from "../KojiAppearance";
export declare type DisplayTextType = "title" | "description";
export interface DisplayTextProps {
    parentElement: HTMLElement;
    displayType: DisplayTextType;
    text: string | Observable<string>;
    theme?: KojiTheme | Observable<KojiTheme>;
}
export declare class DisplayText extends Actor<DisplayTextProps> {
    constructor(props: DisplayTextProps);
    onActivate(): void;
}
