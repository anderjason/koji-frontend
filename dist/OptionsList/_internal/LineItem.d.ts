import { Actor } from "skytree";
import { Observable, ObservableBase } from "@anderjason/observable";
export interface DetailAccessoryData {
    type: "detail";
    onClick: () => void;
    text?: ObservableBase<string>;
}
export interface ToggleAccessoryData {
    type: "toggle";
    isActive: Observable<boolean>;
}
export interface RadioAccessoryData {
    type: "radio";
    key: string;
    selectedKey: Observable<string>;
}
export declare type LineItemAccessoryData = DetailAccessoryData | ToggleAccessoryData | RadioAccessoryData;
export interface LineItemProps {
    parentElement: HTMLElement;
    label: string;
    accessoryData: LineItemAccessoryData;
}
export declare class LineItem extends Actor<LineItemProps> {
    onActivate(): void;
}
