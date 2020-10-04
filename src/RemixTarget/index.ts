import { Color } from "@anderjason/color";
import { Point2 } from "@anderjason/geometry";
import { Observable, Receipt } from "@anderjason/observable";
import { ArrayUtil, ValuePath } from "@anderjason/util";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { Actor } from "skytree";
import { Vcc } from "../Vcc";
import { ManagedSvg } from "./_internal/ManagedSvg";
import { Polygon } from "./_internal/Polygon";
import { svgStyleGivenStrokeWidth } from "./_internal/svgStyleGivenStrokeWidth";

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

export class RemixTarget extends Actor<RemixTargetDefinition> {
  private _activeRemixTarget: ActiveRemixTarget | undefined;

  onActivate() {
    this.cancelOnDeactivate(
      Vcc.instance.mode.didChange.subscribe((mode) => {
        if (this._activeRemixTarget != null) {
          this.removeActor(this._activeRemixTarget);
          this._activeRemixTarget = undefined;
        }

        if (mode !== "view") {
          this._activeRemixTarget = this.addActor(
            new ActiveRemixTarget(this.props)
          );
        }
      }, true)
    );
  }
}

class ActiveRemixTarget extends Actor<RemixTargetDefinition> {
  private static allTargets = new Set<ActiveRemixTarget>();
  private static hoveredTarget = Observable.ofEmpty<ActiveRemixTarget>();

  private static reorderAllTargets() {
    const orderedTargets = ArrayUtil.arrayWithOrderFromValue(
      Array.from(ActiveRemixTarget.allTargets),
      (target) => {
        if (target == null || target.props.points == null) {
          return 0;
        }

        let left: number | undefined;
        let right: number | undefined;
        let top: number | undefined;
        let bottom: number | undefined;

        target.props.points.value.forEach((point) => {
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

  readonly polygon = Observable.givenValue<Polygon>(Polygon.ofPoints([]));
  readonly zIndex = Observable.givenValue(500);

  private _svg: ManagedSvg | undefined;
  private _isSelectable: Observable<boolean>;
  private _isEnabled: Observable<boolean>;
  private _wrapper: ManagedElement<HTMLDivElement>;
  private _className = Observable.ofEmpty<string>();
  private _dynamicSvgStyle: ElementStyle;

  constructor(props: RemixTargetDefinition) {
    super(props);

    this._isEnabled = props.isEnabled || Observable.givenValue(true);
    this._isSelectable = props.isSelectable || Observable.givenValue(true);
  }

  onActivate() {
    this.cancelOnDeactivate(
      this.props.points.didChange.subscribe((points) => {
        if (points != null) {
          this.polygon.setValue(
            Polygon.ofPoints(points).withExpansion(this.props.expansion || -10)
          );
        }

        ActiveRemixTarget.reorderAllTargets();
      }, true)
    );

    this._wrapper = this.addActor(
      ManagedElement.givenDefinition({
        tagName: "div",
        parentElement: this.props.parentElement || document.body,
      })
    );

    const color = this.props.color || Color.givenHexString("#FFFFFF");
    this._wrapper.style.color = color.toHexString();

    this._dynamicSvgStyle = svgStyleGivenStrokeWidth(
      this.props.strokeWidth || 3
    );
    this._className.setValue(this._dynamicSvgStyle.toCombinedClassName());

    this._svg = this.addActor(
      new ManagedSvg({
        parentElement: this._wrapper.element,
        polygon: this.polygon,
        radius: this.props.cornerRadius || 15,
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

    this.cancelOnDeactivate(
      this.zIndex.didChange.subscribe((zIndex) => {
        if (this._svg != null) {
          this._svg.style.zIndex = `${zIndex}`;
        }
      }, true)
    );

    this.cancelOnDeactivate(
      this._isEnabled.didChange.subscribe(() => {
        this.recalculateOpacity();
      })
    );
    this.cancelOnDeactivate(
      this._isSelectable.didChange.subscribe(() => {
        this.recalculateOpacity();
      })
    );
    this.cancelOnDeactivate(
      ActiveRemixTarget.hoveredTarget.didChange.subscribe(() => {
        this.recalculateOpacity();
      })
    );
    this.recalculateOpacity();

    ActiveRemixTarget.allTargets.add(this);
    ActiveRemixTarget.reorderAllTargets();

    this.cancelOnDeactivate(
      new Receipt(() => {
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
    if (this.props.onClick != null) {
      try {
        this.props.onClick(point);
      } catch (err) {
        console.warn(err);
      }
    }

    if (this.props.valuePath != null) {
      Vcc.instance.selectedPath.setValue(this.props.valuePath);
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
