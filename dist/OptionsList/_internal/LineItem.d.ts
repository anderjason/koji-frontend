import { ObservableDict } from "@anderjason/observable";
import { Actor } from "skytree";
import { OptionDefinition } from "..";
export interface LineItemProps {
    parentElement: HTMLElement;
    optionDefinition: OptionDefinition;
    valuesByPropertyName: ObservableDict<any>;
}
export declare class LineItem extends Actor<LineItemProps> {
    onActivate(): void;
}
