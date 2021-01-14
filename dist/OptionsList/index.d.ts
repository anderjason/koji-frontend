import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export interface DetailOptionDefinition {
    key: string;
    type: "detail";
    label: string;
    onClick: () => void;
    text?: string;
}
export interface ToggleOptionDefinition {
    key: string;
    type: "toggle";
    label: string;
    defaultValue: boolean;
    onChange: (value: boolean) => void;
}
export interface RadioOptionDefinition {
    key: string;
    type: "radio";
    label: string;
    selectedKey: Observable<string>;
}
export declare type OptionDefinition = DetailOptionDefinition | ToggleOptionDefinition | RadioOptionDefinition;
export interface OptionsListProps {
    parentElement: HTMLElement;
    options: Observable<OptionDefinition[]>;
}
export declare class OptionsList extends Actor<OptionsListProps> {
    constructor(props: OptionsListProps);
    onActivate(): void;
}
