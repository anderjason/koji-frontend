import { Actor } from "skytree";
import { Observable, ObservableBase } from "@anderjason/observable";
export interface TextAccessoryData {
    type: "text";
    text: ObservableBase<string>;
    onClick: () => void;
}
export interface ToggleAccessoryData {
    type: "toggle";
    isActive: Observable<boolean>;
}
export declare type LineItemAccessoryData = TextAccessoryData | ToggleAccessoryData;
export interface LineItemProps {
    parentElement: HTMLElement;
    label: string;
    accessoryData: LineItemAccessoryData;
}
export declare class LineItem extends Actor<LineItemProps> {
    onActivate(): void;
}
