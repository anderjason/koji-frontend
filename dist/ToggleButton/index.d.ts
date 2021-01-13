import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
export interface ToggleButtonProps {
    target: ThisOrParentElement<HTMLButtonElement>;
    isActive: Observable<boolean>;
}
export declare class ToggleButton extends Actor<ToggleButtonProps> {
    onActivate(): void;
    private onClick;
}
