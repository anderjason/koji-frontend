import { Actor } from "skytree";
import { ObservableDict } from "@anderjason/observable";
export interface RadioAccessoryProps {
    parentElement: HTMLElement;
    propertyName: string;
    propertyValue: any;
    valuesByPropertyName: ObservableDict<any>;
}
export declare class RadioAccessory extends Actor<RadioAccessoryProps> {
    onActivate(): void;
}
