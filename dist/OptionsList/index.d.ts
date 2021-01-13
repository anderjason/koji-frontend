import { ObservableArray } from "@anderjason/observable";
import { Actor } from "skytree";
import { LineItemAccessoryData } from "./_internal/LineItem";
export interface OptionsListItemData {
    label: string;
    accessoryData: LineItemAccessoryData;
}
export interface OptionsListProps {
    parentElement: HTMLElement;
    items: ObservableArray<OptionsListItemData>;
}
export declare class OptionsList extends Actor<OptionsListProps> {
    constructor(props: OptionsListProps);
    onActivate(): void;
}
