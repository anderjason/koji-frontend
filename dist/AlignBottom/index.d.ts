import { ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
export interface AlignBottomProps {
    target: ThisOrParentElement<HTMLDivElement>;
    isRemixing: boolean | ObservableBase<boolean>;
}
export declare class AlignBottom extends Actor<AlignBottomProps> {
    private _element;
    private _isRemixing;
    constructor(props: AlignBottomProps);
    get element(): HTMLElement;
    onActivate(): void;
}
