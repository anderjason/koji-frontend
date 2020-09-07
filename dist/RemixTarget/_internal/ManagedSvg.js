"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedSvg = void 0;
const geometry_1 = require("@anderjason/geometry");
const observable_1 = require("@anderjason/observable");
const skytree_1 = require("skytree");
class ManagedSvg extends skytree_1.ManagedObject {
    constructor(definition) {
        super();
        this._parentElement = definition.parentElement;
        this._polygon = definition.polygon;
        this._radius = definition.radius;
        this._className = definition.className;
        this._onClick = definition.onClick;
        this._onLeave = definition.onLeave;
        this._onHover = definition.onHover;
    }
    static ofDefinition(definition) {
        return new ManagedSvg(definition);
    }
    get style() {
        if (this._svg == null) {
            return undefined;
        }
        return this._svg.style;
    }
    initManagedObject() {
        this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const solidPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        solidPath.setAttributeNS(null, "class", "solid");
        const dashedPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dashedPath.setAttributeNS(null, "class", "dashed");
        this._svg.setAttribute("aria-hidden", "true");
        this._svg.setAttribute("width", "100%");
        this._svg.setAttribute("height", "100%");
        this.addReceipt(this._className.didChange.subscribe((className) => {
            this._svg.setAttributeNS(null, "class", className || "");
        }, true));
        const onClick = (e) => {
            const point = geometry_1.Point2.givenXY(e.clientX, e.clientY);
            this._onClick(point);
        };
        const onTouch = (e) => {
            const point = geometry_1.Point2.givenXY(e.touches[0].clientX, e.touches[0].clientY);
            this._onClick(point);
        };
        const onHover = () => {
            this._onHover();
        };
        const onLeave = () => {
            this._onLeave();
        };
        dashedPath.addEventListener("click", onClick);
        dashedPath.addEventListener("touch", onTouch);
        dashedPath.addEventListener("mouseover", onHover);
        dashedPath.addEventListener("mouseout", onLeave);
        this._svg.appendChild(solidPath);
        this._svg.appendChild(dashedPath);
        this._parentElement.appendChild(this._svg);
        this.addReceipt(this._polygon.didChange.subscribe((polygon) => {
            if (polygon == null || polygon.points.length < 3) {
                return;
            }
            const pathString = polygon.toPathString(this._radius);
            dashedPath.setAttribute("d", pathString);
            solidPath.setAttribute("d", pathString);
        }, true));
        this.addReceipt(observable_1.Receipt.givenCancelFunction(() => {
            this._parentElement.removeChild(this._svg);
            this._svg = undefined;
        }));
    }
}
exports.ManagedSvg = ManagedSvg;
//# sourceMappingURL=ManagedSvg.js.map