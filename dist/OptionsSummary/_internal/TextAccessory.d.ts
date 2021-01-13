import { Actor } from "skytree";
import { ObservableBase } from "@anderjason/observable";
export interface TextAccessoryProps {
    parentElement: HTMLElement;
    label: ObservableBase<string>;
}
export declare class TextAccessory extends Actor<TextAccessoryProps> {
    onActivate(): void;
}
