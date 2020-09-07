import { Color } from "@anderjason/color";
import { Point2 } from "@anderjason/geometry";
import { Observable, Receipt } from "@anderjason/observable";
import { ArrayUtil, ValuePath } from "@anderjason/util";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { ManagedObject } from "skytree";
import { KojiConfig } from "../KojiConfig";
import { ManagedSvg } from "./_internal/ManagedSvg";
import { Polygon } from "./_internal/Polygon";
import { svgStyleGivenStrokeWidth } from "./_internal/svgStyleGivenStrokeWidth";

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

export class RemixTarget extends ManagedObject {
  static givenPoints(
    points: Observable<Point2[]>,
    definition: RemixTargetDefinition
  ): RemixTarget {
    if (points == null) {
      throw new Error("Points are required");
    }

    if (definition == null) {
      throw new Error("Definition is required");
    }

    return new RemixTarget(points, definition);
  }

  private _points: Observable<Point2[]>;
  private _definition: RemixTargetDefinition;
  private _activeRemixTarget: ActiveRemixTarget | undefined;

  private constructor(
    points: Observable<Point2[]>,
    definition: RemixTargetDefinition
  ) {
    super();

    this._points = points;
    this._definition = definition;
  }

  initManagedObject() {
    this.addReceipt(
      KojiConfig.instance.mode.didChange.subscribe((mode) => {
        if (this._activeRemixTarget != null) {
          this.removeManagedObject(this._activeRemixTarget);
          this._activeRemixTarget = undefined;
        }

        if (mode === "template") {
          this._activeRemixTarget = this.addManagedObject(
            ActiveRemixTarget.givenPoints(this._points, this._definition)
          );
        }
      }, true)
    );
  }
}

class ActiveRemixTarget extends ManagedObject {
  private static allTargets = new Set<ActiveRemixTarget>();
  private static hoveredTarget = Observable.ofEmpty<ActiveRemixTarget>();

  private static reorderAllTargets() {
    const orderedTargets = ArrayUtil.arrayWithOrderFromValue(
      Array.from(ActiveRemixTarget.allTargets),
      (target) => {
        if (target == null || target._points == null) {
          return 0;
        }

        let left: number | undefined;
        let right: number | undefined;
        let top: number | undefined;
        let bottom: number | undefined;

        target._points.value.forEach((point) => {
          if (left == null || point.x < left) {
            left = point.x;
          }

          if (right == null || point.x > right) {
            right = point.x;
          }

          if (top == null || point.y < top) {
            top = point.y;
          }

          if (bottom == null || point.y > bottom) {
            bottom = point.y;
          }
        });

        const width = right - left;
        const height = bottom - top;
        const area = width * height;

        return area;
      },
      "ascending"
    );

    orderedTargets.reverse().forEach((target, idx) => {
      target.zIndex.setValue(500 + idx);
    });
  }

  static givenPoints(
    points: Observable<Point2[]>,
    definition: RemixTargetDefinition
  ): ActiveRemixTarget {
    return new ActiveRemixTarget(points, definition);
  }

  readonly valuePath: ValuePath | undefined;
  readonly polygon = Observable.givenValue<Polygon>(Polygon.ofPoints([]));
  readonly zIndex = Observable.givenValue(500);

  private _svg: ManagedSvg | undefined;
  private _onClick?: (point: Point2) => void;
  private _points: Observable<Point2[]>;
  private _expansion: number;
  private _color: Color;
  private _cornerRadius: number;
  private _strokeWidth: number;
  private _parentElement: HTMLElement;
  private _isSelectable: Observable<boolean>;
  private _isEnabled: Observable<boolean>;
  private _wrapper: ManagedElement<HTMLDivElement>;
  private _className = Observable.ofEmpty<string>();
  private _dynamicSvgStyle: ElementStyle;

  private constructor(
    points: Observable<Point2[]>,
    definition: RemixTargetDefinition
  ) {
    super();

    this.valuePath = definition.valuePath;

    this._onClick = definition.onClick;
    this._points = points;
    this._expansion = definition.expansion != null ? definition.expansion : -10;
    this._color = definition.color || Color.givenHexString("#FFFFFF");
    this._parentElement = definition.parentElement || document.body;
    this._isEnabled = definition.isEnabled || Observable.givenValue(true);
    this._isSelectable = definition.isSelectable || Observable.givenValue(true);

    this._cornerRadius =
      definition.cornerRadius != null ? definition.cornerRadius : 15;

    this._strokeWidth =
      definition.strokeWidth != null ? definition.strokeWidth : 3;
  }

  initManagedObject() {
    this.addReceipt(
      this._points.didChange.subscribe((points) => {
        if (points != null) {
          this.polygon.setValue(
            Polygon.ofPoints(points).withExpansion(this._expansion)
          );
        }

        ActiveRemixTarget.reorderAllTargets();
      }, true)
    );

    this._wrapper = this.addManagedObject(
      ManagedElement.givenDefinition({
        tagName: "div",
        parentElement: this._parentElement,
      })
    );
    this._wrapper.style.color = this._color.toHexString();

    this._dynamicSvgStyle = svgStyleGivenStrokeWidth(this._strokeWidth);
    this._className.setValue(this._dynamicSvgStyle.toCombinedClassName());

    this._svg = this.addManagedObject(
      ManagedSvg.ofDefinition({
        parentElement: this._wrapper.element,
        polygon: this.polygon,
        radius: this._cornerRadius,
        className: this._className,
        onClick: (point) => {
          this.onClick(point);
        },
        onHover: () => {
          this.onHover();
        },
        onLeave: () => {
          this.onLeave();
        },
      })
    );

    this.addReceipt(
      this.zIndex.didChange.subscribe((zIndex) => {
        if (this._svg != null) {
          this._svg.style.zIndex = `${zIndex}`;
        }
      }, true)
    );

    this.addReceipt(
      this._isEnabled.didChange.subscribe(() => {
        this.recalculateOpacity();
      })
    );
    this.addReceipt(
      this._isSelectable.didChange.subscribe(() => {
        this.recalculateOpacity();
      })
    );
    this.addReceipt(
      ActiveRemixTarget.hoveredTarget.didChange.subscribe(() => {
        this.recalculateOpacity();
      })
    );
    this.recalculateOpacity();

    ActiveRemixTarget.allTargets.add(this);
    ActiveRemixTarget.reorderAllTargets();

    this.addReceipt(
      Receipt.givenCancelFunction(() => {
        ActiveRemixTarget.allTargets.delete(this);
        ActiveRemixTarget.reorderAllTargets();

        if (ActiveRemixTarget.hoveredTarget.value === this) {
          ActiveRemixTarget.hoveredTarget.setValue(undefined);
        }
      })
    );
  }

  private recalculateOpacity() {
    const isEnabled = this._isEnabled.value;
    const isSelectable = this._isSelectable.value;
    const isAnyHovered = ActiveRemixTarget.hoveredTarget.value != null;
    const isThisHovered = ActiveRemixTarget.hoveredTarget.value === this;

    let opacity: number;

    if (isEnabled) {
      if (isAnyHovered) {
        opacity = isThisHovered ? 1 : 0.2;
      } else {
        opacity = isSelectable ? 1 : 0.4;
      }
    } else {
      opacity = 0;
    }

    this._svg.style.opacity = opacity.toString();

    if (isEnabled && isSelectable) {
      this._className.setValue(
        this._dynamicSvgStyle.toCombinedClassName("isAnimated")
      );
    } else {
      this._className.setValue(this._dynamicSvgStyle.toCombinedClassName());
    }
  }

  private onHover() {
    ActiveRemixTarget.hoveredTarget.setValue(this);
  }

  private onLeave() {
    if (ActiveRemixTarget.hoveredTarget.value === this) {
      ActiveRemixTarget.hoveredTarget.setValue(undefined);
    }
  }

  private onClick(point: Point2) {
    if (this._onClick != null) {
      try {
        this._onClick(point);
      } catch (err) {
        console.warn(err);
      }
    }

    if (this.valuePath != null) {
      KojiConfig.instance.selectedPath.setValue(this.valuePath);
    }
  }
}

export const Container = ElementStyle.givenDefinition({
  css: `
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  `,
});
