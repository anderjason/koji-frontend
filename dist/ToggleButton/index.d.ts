import { Observable, ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
export interface ToggleButtonProps {
    target: ThisOrParentElement<HTMLButtonElement>;
    isToggleActive: Observable<boolean>;
    isDisabled?: boolean | ObservableBase<boolean>;
}
export declare class ToggleButton extends Actor<ToggleButtonProps> {
    private _isDisabled;
    constructor(props: ToggleButtonProps);
    onActivate(): void;
    private onClick;
}
