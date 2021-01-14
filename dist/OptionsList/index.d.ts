import { Dict, ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
export interface DetailOptionDefinition {
    type: "detail";
    label: string;
    onClick: () => void;
    summaryText?: string;
}
export interface ToggleOptionDefinition {
    type: "toggle";
    label: string;
    propertyName: string;
}
export interface RadioOptionDefinition {
    type: "radio";
    label: string;
    propertyName: string;
    propertyValue: string;
}
export declare type OptionDefinition = DetailOptionDefinition | ToggleOptionDefinition | RadioOptionDefinition;
export interface OptionsListProps {
    parentElement: HTMLElement;
    definitions: OptionDefinition[] | ObservableBase<OptionDefinition[]>;
    defaultValues: Dict<any>;
    onChange: (key: string, value: any) => void;
}
export declare class OptionsList extends Actor<OptionsListProps> {
    private _definitions;
    constructor(props: OptionsListProps);
    onActivate(): void;
}
