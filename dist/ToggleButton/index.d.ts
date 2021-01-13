import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export interface ToggleButtonProps {
    parentElement: HTMLElement;
    output: Observable<boolean>;
}
export declare class ToggleButton extends Actor<ToggleButtonProps> {
    onActivate(): void;
    private onClick;
}
