import { Actor } from "skytree";
import { Observable } from "@anderjason/observable";
export interface RadioAccessoryProps {
    parentElement: HTMLElement;
    key: string;
    selectedKey: Observable<string>;
}
export declare class RadioAccessory extends Actor<RadioAccessoryProps> {
    onActivate(): void;
}
