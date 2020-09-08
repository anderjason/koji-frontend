"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.RemixTarget = void 0;
const color_1 = require("@anderjason/color");
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const KojiConfig_1 = require("../KojiConfig");
const ManagedSvg_1 = require("./_internal/ManagedSvg");
const Polygon_1 = require("./_internal/Polygon");
const svgStyleGivenStrokeWidth_1 = require("./_internal/svgStyleGivenStrokeWidth");
class RemixTarget extends skytree_1.ManagedObject {
    constructor(points, definition) {
        super();
        this._points = points;
        this._definition = definition;
    }
    static givenPoints(points, definition) {
        if (points == null) {
            throw new Error("Points are required");
        }
        if (definition == null) {
            throw new Error("Definition is required");
        }
        return new RemixTarget(points, definition);
    }
    initManagedObject() {
        this.addReceipt(KojiConfig_1.KojiConfig.instance.mode.didChange.subscribe((mode) => {
            if (this._activeRemixTarget != null) {
                this.removeManagedObject(this._activeRemixTarget);
                this._activeRemixTarget = undefined;
            }
            if (mode !== "view") {
                this._activeRemixTarget = this.addManagedObject(ActiveRemixTarget.givenPoints(this._points, this._definition));
            }
        }, true));
    }
}
exports.RemixTarget = RemixTarget;
class ActiveRemixTarget extends skytree_1.ManagedObject {
    constructor(points, definition) {
        super();
        this.polygon = observable_1.Observable.givenValue(Polygon_1.Polygon.ofPoints([]));
        this.zIndex = observable_1.Observable.givenValue(500);
        this._className = observable_1.Observable.ofEmpty();
        this.valuePath = definition.valuePath;
        this._onClick = definition.onClick;
        this._points = points;
        this._expansion = definition.expansion != null ? definition.expansion : -10;
        this._color = definition.color || color_1.Color.givenHexString("#FFFFFF");
        this._parentElement = definition.parentElement || document.body;
        this._isEnabled = definition.isEnabled || observable_1.Observable.givenValue(true);
        this._isSelectable = definition.isSelectable || observable_1.Observable.givenValue(true);
        this._cornerRadius =
            definition.cornerRadius != null ? definition.cornerRadius : 15;
        this._strokeWidth =
            definition.strokeWidth != null ? definition.strokeWidth : 3;
    }
    static reorderAllTargets() {
        const orderedTargets = util_1.ArrayUtil.arrayWithOrderFromValue(Array.from(ActiveRemixTarget.allTargets), (target) => {
            if (target == null || target._points == null) {
                return 0;
            }
            let left;
            let right;
            let top;
            let bottom;
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
        }, "ascending");
        orderedTargets.reverse().forEach((target, idx) => {
            target.zIndex.setValue(500 + idx);
        });
    }
    static givenPoints(points, definition) {
        return new ActiveRemixTarget(points, definition);
    }
    initManagedObject() {
        this.addReceipt(this._points.didChange.subscribe((points) => {
            if (points != null) {
                this.polygon.setValue(Polygon_1.Polygon.ofPoints(points).withExpansion(this._expansion));
            }
            ActiveRemixTarget.reorderAllTargets();
        }, true));
        this._wrapper = this.addManagedObject(web_1.ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this._parentElement,
        }));
        this._wrapper.style.color = this._color.toHexString();
        this._dynamicSvgStyle = svgStyleGivenStrokeWidth_1.svgStyleGivenStrokeWidth(this._strokeWidth);
        this._className.setValue(this._dynamicSvgStyle.toCombinedClassName());
        this._svg = this.addManagedObject(ManagedSvg_1.ManagedSvg.ofDefinition({
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
        }));
        this.addReceipt(this.zIndex.didChange.subscribe((zIndex) => {
            if (this._svg != null) {
                this._svg.style.zIndex = `${zIndex}`;
            }
        }, true));
        this.addReceipt(this._isEnabled.didChange.subscribe(() => {
            this.recalculateOpacity();
        }));
        this.addReceipt(this._isSelectable.didChange.subscribe(() => {
            this.recalculateOpacity();
        }));
        this.addReceipt(ActiveRemixTarget.hoveredTarget.didChange.subscribe(() => {
            this.recalculateOpacity();
        }));
        this.recalculateOpacity();
        ActiveRemixTarget.allTargets.add(this);
        ActiveRemixTarget.reorderAllTargets();
        this.addReceipt(observable_1.Receipt.givenCancelFunction(() => {
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
        if (this._onClick != null) {
            try {
                this._onClick(point);
            }
            catch (err) {
                console.warn(err);
            }
        }
        if (this.valuePath != null) {
            KojiConfig_1.KojiConfig.instance.selectedPath.setValue(this.valuePath);
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