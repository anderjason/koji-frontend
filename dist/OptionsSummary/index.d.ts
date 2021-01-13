import { ObservableArray } from "@anderjason/observable";
import { Actor } from "skytree";
import { LineItemAccessoryData } from "./_internal/LineItem";
export interface OptionsSummaryItemData {
    label: string;
    accessoryData: LineItemAccessoryData;
}
export interface OptionsSummaryProps {
    parentElement: HTMLElement;
    items: ObservableArray<OptionsSummaryItemData>;
}
export declare class OptionsSummary extends Actor<OptionsSummaryProps> {
    constructor(props: OptionsSummaryProps);
    onActivate(): void;
}
