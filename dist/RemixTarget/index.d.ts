import { Color } from "@anderjason/color";
import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { Polygon } from "./_internal/Polygon";
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
    private static allTargets;
    private static hoveredTarget;
    private static reorderAllTargets;
    readonly polygon: Observable<Polygon>;
    readonly zIndex: Observable<number>;
    private _svg;
    private _isSelectable;
    private _isEnabled;
    private _wrapper;
    private _className;
    private _dynamicSvgStyle;
    constructor(props: RemixTargetDefinition);
    onActivate(): void;
    private recalculateOpacity;
    private onHover;
    private onLeave;
    private onClick;
}
export declare const Container: ElementStyle;
