import { ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { KojiTheme } from "../KojiAppearance";
export declare type SubmitButtonMode = "ready" | "busy" | "success";
export interface SubmitButtonProps {
    buttonMode: SubmitButtonMode | ObservableBase<SubmitButtonMode>;
    onClick: () => void;
    target: ThisOrParentElement<HTMLButtonElement>;
    text: string | ObservableBase<string>;
    theme: KojiTheme | ObservableBase<KojiTheme>;
}
export declare class SubmitButton extends Actor<SubmitButtonProps> {
    onActivate(): void;
}
