import { Box2, Point2 } from "@anderjason/geometry";
export declare class Polygon {
    readonly points: Point2[];
    static ofPoints(points: Point2[]): Polygon;
    private constructor();
    get isClockwise(): boolean;
    withExpansion: (distance: number) => Polygon;
    toPathString: (cornerRadius?: number) => string;
    toBounds: () => Box2;
}
