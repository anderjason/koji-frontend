import { Box2, Point2 } from "@anderjason/geometry";
import { NumberUtil } from "@anderjason/util";

function vecUnit(v: Point2): Point2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  return Point2.givenXY(v.x / len, v.y / len);
}

function vecMul(v: Point2, s: number): Point2 {
  return Point2.givenXY(v.x * s, v.y * s);
}

function vecDot(v1: Point2, v2: Point2): number {
  return v1.x * v2.x + v1.y * v2.y;
}

function vecRot90CW(v: Point2): Point2 {
  return Point2.givenXY(v.y, -v.x);
}

function vecRot90CCW(v: Point2): Point2 {
  return Point2.givenXY(-v.y, v.x);
}

interface Line {
  start: Point2;
  end: Point2;
}

function roundedPathStringGivenPolygon(polygon: Polygon, radius: number) {
  let pathCoords = polygon.points;

  const path = [];

  // Reset indexes, so there are no gaps
  pathCoords = pathCoords.slice();

  for (let i = 0; i < pathCoords.length; i++) {
    // 1. Get current coord and the next two (startpoint, cornerpoint, endpoint) to calculate rounded curve
    const c2Index =
      i + 1 > pathCoords.length - 1 ? (i + 1) % pathCoords.length : i + 1;
    const c3Index =
      i + 2 > pathCoords.length - 1 ? (i + 2) % pathCoords.length : i + 2;

    const c1 = pathCoords[i];
    const c2 = pathCoords[c2Index];
    const c3 = pathCoords[c3Index];

    let thisRadius = radius;

    // 2. For each 3 coords, enter two new path commands: Line to start of curve, bezier curve around corner.

    // Calculate curvePoint c1 -> c2
    const c1c2Distance = Math.sqrt(
      Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)
    );

    const c2c3Distance = Math.sqrt(
      Math.pow(c2.x - c3.x, 2) + Math.pow(c2.y - c3.y, 2)
    );

    const minDistance = Math.min(c1c2Distance, c2c3Distance);
    const threshold = 30;
    if (minDistance < threshold) {
      thisRadius = NumberUtil.numberWithRangeMap(
        minDistance,
        0,
        threshold,
        0,
        radius
      );
    }

    const c1c2DistanceRatio = (c1c2Distance - thisRadius) / c1c2Distance;
    const c1c2CurvePoint = [
      ((1 - c1c2DistanceRatio) * c1.x + c1c2DistanceRatio * c2.x).toFixed(1),
      ((1 - c1c2DistanceRatio) * c1.y + c1c2DistanceRatio * c2.y).toFixed(1),
    ];

    // Calculate curvePoint c2 -> c3
    const c2c3DistanceRatio = thisRadius / c2c3Distance;
    const c2c3CurvePoint = [
      ((1 - c2c3DistanceRatio) * c2.x + c2c3DistanceRatio * c3.x).toFixed(1),
      ((1 - c2c3DistanceRatio) * c2.y + c2c3DistanceRatio * c3.y).toFixed(1),
    ];

    // If at last coord of polygon, also save that as starting point
    if (i === pathCoords.length - 1) {
      path.unshift("M" + c2c3CurvePoint.join(","));
    }

    // Line to start of curve (L endcoord)
    path.push("L" + c1c2CurvePoint.join(","));
    // Bezier line around curve (Q controlcoord endcoord)
    path.push("Q" + c2.x + "," + c2.y + "," + c2c3CurvePoint.join(","));
  }

  path.push("Z");

  return path.join(" ");
}

function intersect(line1: Line, line2: Line): Point2 {
  const a1 = line1.end.x - line1.start.x;
  const b1 = line2.start.x - line2.end.x;
  const c1 = line2.start.x - line1.start.x;

  const a2 = line1.end.y - line1.start.y;
  const b2 = line2.start.y - line2.end.y;
  const c2 = line2.start.y - line1.start.y;

  const t = (b1 * c2 - b2 * c1) / (a2 * b1 - a1 * b2);

  return Point2.givenXY(
    line1.start.x + t * (line1.end.x - line1.start.x),
    line1.start.y + t * (line1.end.y - line1.start.y)
  );
}

export class Polygon {
  readonly points: Point2[];

  static ofPoints(points: Point2[]) {
    return new Polygon(points);
  }

  private constructor(points: Point2[]) {
    this.points = points;
  }

  get isClockwise() {
    if (this.points == null || this.points.length < 3) {
      return;
    }

    const p = this.points;

    return (
      vecDot(
        vecRot90CW(Point2.givenXY(p[1].x - p[0].x, p[1].y - p[0].y)),
        Point2.givenXY(p[2].x - p[1].x, p[2].y - p[1].y)
      ) >= 0
    );
  }

  withExpansion = (distance: number): Polygon => {
    const expanded = [];
    const rot = this.isClockwise ? vecRot90CCW : vecRot90CW;

    const p = this.points;

    for (let i = 0; i < p.length; ++i) {
      // get this point (pt1), the point before it
      // (pt0) and the point that follows it (pt2)
      const pt0 = p[i > 0 ? i - 1 : p.length - 1];
      const pt1 = p[i];
      const pt2 = p[i < p.length - 1 ? i + 1 : 0];

      // find the line vectors of the lines going
      // into the current point
      const v01 = Point2.givenXY(pt1.x - pt0.x, pt1.y - pt0.y);
      const v12 = Point2.givenXY(pt2.x - pt1.x, pt2.y - pt1.y);

      // find the normals of the two lines, multiplied
      // to the distance that polygon should inflate
      const d01 = vecMul(vecUnit(rot(v01)), distance);
      const d12 = vecMul(vecUnit(rot(v12)), distance);

      // use the normals to find two points on the
      // lines parallel to the polygon lines
      const ptx0 = Point2.givenXY(pt0.x + d01.x, pt0.y + d01.y);
      const ptx10 = Point2.givenXY(pt1.x + d01.x, pt1.y + d01.y);
      const ptx12 = Point2.givenXY(pt1.x + d12.x, pt1.y + d12.y);
      const ptx2 = Point2.givenXY(pt2.x + d12.x, pt2.y + d12.y);

      // find the intersection of the two lines, and
      // add it to the expanded polygon
      expanded.push(
        intersect({ start: ptx0, end: ptx10 }, { start: ptx12, end: ptx2 })
      );
    }

    return Polygon.ofPoints(expanded);
  };

  toPathString = (cornerRadius: number = 0): string => {
    return roundedPathStringGivenPolygon(this, cornerRadius);
  };

  toBounds = () => {
    const allX = this.points.map((p) => p.x);
    const allY = this.points.map((p) => p.y);

    const minX = Math.min(...allX);
    const minY = Math.min(...allY);

    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);

    const topLeft = Point2.givenXY(minX, minY);
    const bottomRight = Point2.givenXY(maxX, maxY);

    return Box2.givenOppositeCorners(topLeft, bottomRight);
  };
}
