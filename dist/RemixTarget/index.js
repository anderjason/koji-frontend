"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.RemixTarget = void 0;
const color_1 = require("@anderjason/color");
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const Vcc_1 = require("../Vcc");
const ManagedSvg_1 = require("./_internal/ManagedSvg");
const Polygon_1 = require("./_internal/Polygon");
const svgStyleGivenStrokeWidth_1 = require("./_internal/svgStyleGivenStrokeWidth");
class RemixTarget extends skytree_1.Actor {
    onActivate() {
        this.cancelOnDeactivate(Vcc_1.Vcc.instance.mode.didChange.subscribe((mode) => {
            if (this._activeRemixTarget != null) {
                this.removeActor(this._activeRemixTarget);
                this._activeRemixTarget = undefined;
            }
            if (mode !== "view") {
                this._activeRemixTarget = this.addActor(new ActiveRemixTarget(this.props));
            }
        }, true));
    }
}
exports.RemixTarget = RemixTarget;
class ActiveRemixTarget extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this.polygon = observable_1.Observable.givenValue(Polygon_1.Polygon.ofPoints([]));
        this.zIndex = observable_1.Observable.givenValue(500);
        this._className = observable_1.Observable.ofEmpty();
        this._isEnabled = props.isEnabled || observable_1.Observable.givenValue(true);
        this._isSelectable = props.isSelectable || observable_1.Observable.givenValue(true);
    }
    static reorderAllTargets() {
        const orderedTargets = util_1.ArrayUtil.arrayWithOrderFromValue(Array.from(ActiveRemixTarget.allTargets), (target) => {
            if (target == null || target.props.points == null) {
                return 0;
            }
            let left;
            let right;
            let top;
            let bottom;
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
        }, "ascending");
        orderedTargets.reverse().forEach((target, idx) => {
            target.zIndex.setValue(500 + idx);
        });
    }
    onActivate() {
        this.cancelOnDeactivate(this.props.points.didChange.subscribe((points) => {
            if (points != null) {
                this.polygon.setValue(Polygon_1.Polygon.ofPoints(points).withExpansion(this.props.expansion || -10));
            }
            ActiveRemixTarget.reorderAllTargets();
        }, true));
        this._wrapper = this.addActor(web_1.ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this.props.parentElement || document.body,
        }));
        const color = this.props.color || color_1.Color.givenHexString("#FFFFFF");
        this._wrapper.style.color = color.toHexString();
        this._dynamicSvgStyle = svgStyleGivenStrokeWidth_1.svgStyleGivenStrokeWidth(this.props.strokeWidth || 3);
        this._className.setValue(this._dynamicSvgStyle.toCombinedClassName());
        this._svg = this.addActor(new ManagedSvg_1.ManagedSvg({
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
        }));
        this.cancelOnDeactivate(this.zIndex.didChange.subscribe((zIndex) => {
            if (this._svg != null) {
                this._svg.style.zIndex = `${zIndex}`;
            }
        }, true));
        this.cancelOnDeactivate(this._isEnabled.didChange.subscribe(() => {
            this.recalculateOpacity();
        }));
        this.cancelOnDeactivate(this._isSelectable.didChange.subscribe(() => {
            this.recalculateOpacity();
        }));
        this.cancelOnDeactivate(ActiveRemixTarget.hoveredTarget.didChange.subscribe(() => {
            this.recalculateOpacity();
        }));
        this.recalculateOpacity();
        ActiveRemixTarget.allTargets.add(this);
        ActiveRemixTarget.reorderAllTargets();
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            ActiveRemixTarget.allTargets.delete(this);
            ActiveRemixTarget.reorderAllTargets();
            if (ActiveRemixTarget.hoveredTarget.value === this) {
                ActiveRemixTarget.hoveredTarget.setValue(undefined);
            }
        }));
    }
    recalculateOpacity() {
        const isEnabled = this._isEnabled.value;
        const isSelectable = this._isSelectable.value;
        const isAnyHovered = ActiveRemixTarget.hoveredTarget.value != null;
        const isThisHovered = ActiveRemixTarget.hoveredTarget.value === this;
        let opacity;
        if (isEnabled) {
            if (isAnyHovered) {
                opacity = isThisHovered ? 1 : 0.2;
            }
            else {
                opacity = isSelectable ? 1 : 0.4;
            }
        }
        else {
            opacity = 0;
        }
        this._svg.style.opacity = opacity.toString();
        if (isEnabled && isSelectable) {
            this._className.setValue(this._dynamicSvgStyle.toCombinedClassName("isAnimated"));
        }
        else {
            this._className.setValue(this._dynamicSvgStyle.toCombinedClassName());
        }
    }
    onHover() {
        ActiveRemixTarget.hoveredTarget.setValue(this);
    }
    onLeave() {
        if (ActiveRemixTarget.hoveredTarget.value === this) {
            ActiveRemixTarget.hoveredTarget.setValue(undefined);
        }
    }
    onClick(point) {
        if (this.props.onClick != null) {
            try {
                this.props.onClick(point);
            }
            catch (err) {
                console.warn(err);
            }
        }
        if (this.props.valuePath != null) {
            Vcc_1.Vcc.instance.selectedPath.setValue(this.props.valuePath);
        }
    }
}
ActiveRemixTarget.allTargets = new Set();
ActiveRemixTarget.hoveredTarget = observable_1.Observable.ofEmpty();
exports.Container = web_1.ElementStyle.givenDefinition({
    css: `
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  `,
});
//# sourceMappingURL=index.js.map