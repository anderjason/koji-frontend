import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Polygon } from "./Polygon";
interface ManagedSvgProps {
    parentElement: HTMLElement;
    polygon: Observable<Polygon>;
    radius: number;
    className: Observable<string>;
    onClick: (point: Point2) => void;
    onHover: () => void;
    onLeave: () => void;
}
export declare class ManagedSvg extends Actor<ManagedSvgProps> {
    private _svg;
    get style(): CSSStyleDeclaration | undefined;
    onActivate(): void;
}
export {};
