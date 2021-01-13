import { Actor } from "skytree";
import { Observable } from "@anderjason/observable";
export interface ToggleAccessoryProps {
    parentElement: HTMLElement;
    isActive: Observable<boolean>;
}
export declare class ToggleAccessory extends Actor<ToggleAccessoryProps> {
    onActivate(): void;
}
