import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export declare type CalloutSide = "right" | "left";
export interface CalloutProps {
    calloutSide: Observable<CalloutSide>;
    parentElement: HTMLElement;
    screenPoint: Observable<Point2>;
    text: string;
}
export declare class Callout extends Actor<CalloutProps> {
    constructor(props: CalloutProps);
    onActivate(): void;
}
