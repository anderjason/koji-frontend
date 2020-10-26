import { Observable, ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
import { KojiTheme } from "../KojiAppearance";
export declare type ButtonMode = "ready" | "busy" | "success";
export interface ParentElement {
    type: "parentElement";
    parentElement: HTMLElement | Observable<HTMLElement>;
}
export interface ThisElement<T> {
    type: "thisElement";
    element: T;
}
export declare type ThisOrParentElement<T> = ParentElement | ThisElement<T>;
export interface UnlockButtonProps {
    buttonMode: ButtonMode | ObservableBase<ButtonMode>;
    onClick: () => void;
    element: ThisOrParentElement<HTMLButtonElement>;
    text: string | ObservableBase<string>;
    theme: KojiTheme | ObservableBase<KojiTheme>;
}
export declare class Button extends Actor<UnlockButtonProps> {
    onActivate(): void;
}
