import { Color } from "@anderjason/color";
import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { Polygon } from "./_internal/Polygon";
export interface RemixTargetDefinition {
    points: Observable<Point2[]>;
    color?: Color;
    cornerRadius?: number;
    expansion?: number;
    isEnabled?: Observable<boolean>;
    isSelectable?: Observable<boolean>;
    onClick?: (point: Point2) => void;
    parentElement?: HTMLElement;
    strokeWidth?: number;
    valuePath?: ValuePath;
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
