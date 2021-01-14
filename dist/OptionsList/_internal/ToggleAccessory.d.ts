import { Actor } from "skytree";
import { ObservableDict } from "@anderjason/observable";
export interface ToggleAccessoryProps {
    parentElement: HTMLElement;
    propertyName: string;
    valuesByPropertyName: ObservableDict<any>;
}
export declare class ToggleAccessory extends Actor<ToggleAccessoryProps> {
    onActivate(): void;
}
