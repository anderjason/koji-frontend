import { Color } from "@anderjason/color";
import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { ElementStyle } from "@anderjason/web";
import { ManagedObject } from "skytree";
export interface RemixTargetDefinition {
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
export declare class RemixTarget extends ManagedObject {
    static givenPoints(points: Observable<Point2[]>, definition: RemixTargetDefinition): RemixTarget;
    private _points;
    private _definition;
    private _activeRemixTarget;
    private constructor();
    initManagedObject(): void;
}
export declare const Container: ElementStyle;
