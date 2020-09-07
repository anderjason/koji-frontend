import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { ManagedObject } from "skytree";
import { Polygon } from "./Polygon";
interface ManagedSvgDefinition {
    parentElement: HTMLElement;
    polygon: Observable<Polygon>;
    radius: number;
    className: Observable<string>;
    onClick: (point: Point2) => void;
    onHover: () => void;
    onLeave: () => void;
}
export declare class ManagedSvg extends ManagedObject {
    static ofDefinition(definition: ManagedSvgDefinition): ManagedSvg;
    private _parentElement;
    private _polygon;
    private _radius;
    private _className;
    private _onClick;
    private _onHover;
    private _onLeave;
    private _svg;
    private constructor();
    get style(): CSSStyleDeclaration | undefined;
    initManagedObject(): void;
}
export {};
