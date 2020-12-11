import { ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { KojiTheme } from "../KojiAppearance";
export declare type SubmitButtonMode = "ready" | "busy" | "success" | "disabled";
export interface SubmitButtonProps {
    buttonMode: SubmitButtonMode | ObservableBase<SubmitButtonMode>;
    onClick: () => void;
    target: ThisOrParentElement<HTMLButtonElement>;
    text: string | ObservableBase<string>;
    theme?: KojiTheme | ObservableBase<KojiTheme>;
}
export declare class SubmitButton extends Actor<SubmitButtonProps> {
    private _text;
    private _buttonMode;
    private _theme;
    constructor(props: SubmitButtonProps);
    onActivate(): void;
}
