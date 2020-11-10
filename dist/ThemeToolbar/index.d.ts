import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { KojiTheme } from "../KojiAppearance";
export interface ThemeToolbarProps {
    parentElement: HTMLElement | Observable<HTMLElement>;
    output?: Observable<KojiTheme>;
    themes?: KojiTheme[];
}
export declare class ThemeToolbar extends Actor<ThemeToolbarProps> {
    readonly output: Observable<KojiTheme>;
    constructor(props: ThemeToolbarProps);
    onActivate(): void;
}
