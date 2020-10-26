import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
export interface ThemeToolbarDefinition {
    parentElement: HTMLElement | Observable<HTMLElement>;
    vccPath: ValuePath;
    themeKeys?: string[];
}
export declare class ThemeToolbar extends Actor<ThemeToolbarDefinition> {
    onActivate(): void;
}
