import { Box2 } from "@anderjason/geometry";
import { Observable, ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
export interface CalloutProps {
    parentElement: HTMLElement | Observable<HTMLElement>;
    targetBox: Box2 | ObservableBase<Box2>;
    text: string | ObservableBase<string>;
}
export declare class Callout extends Actor<CalloutProps> {
    constructor(props: CalloutProps);
    onActivate(): void;
}
