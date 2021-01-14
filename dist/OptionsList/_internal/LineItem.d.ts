import { Actor } from "skytree";
import { OptionDefinition } from "..";
export interface LineItemProps {
    parentElement: HTMLElement;
    optionDefinition: OptionDefinition;
}
export declare class LineItem extends Actor<LineItemProps> {
    onActivate(): void;
}
