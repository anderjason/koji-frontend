import { Actor } from "skytree";
import { ObservableDict } from "@anderjason/observable";
export interface ToggleAccessoryProps {
    parentElement: HTMLElement;
    propertyName: string;
    valuesByPropertyName: ObservableDict<any>;
    isDisabled?: boolean;
}
export declare class ToggleAccessory extends Actor<ToggleAccessoryProps> {
    onActivate(): void;
}
