import { Color } from "@anderjason/color";
import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
export interface RemixTargetDefinition {
    points: Observable<Point2[]>;
    onClick?: (point: Point2) => void;
    valuePath?: ValuePath;
    expansion?: number;
    color?: Color;
    cornerRadius?: number;
    strokeWidth?: number;
    parentElement?: HTMLElement;
    isSelectable?: Observable<boolean>;
    isEnabled?: Observable<boolean>;
}
export declare class RemixTarget extends Actor<RemixTargetDefinition> {
    private _activeRemixTarget;
    onActivate(): void;
}
export declare const Container: ElementStyle;
