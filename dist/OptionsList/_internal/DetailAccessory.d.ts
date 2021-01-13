import { Actor } from "skytree";
import { ObservableBase } from "@anderjason/observable";
export interface DetailAccessoryProps {
    parentElement: HTMLElement;
    text?: ObservableBase<string>;
}
export declare class DetailAccessory extends Actor<DetailAccessoryProps> {
    private _text;
    constructor(props: DetailAccessoryProps);
    onActivate(): void;
}
