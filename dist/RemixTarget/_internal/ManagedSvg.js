"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedSvg = void 0;
const geometry_1 = require("@anderjason/geometry");
const observable_1 = require("@anderjason/observable");
const skytree_1 = require("skytree");
class ManagedSvg extends skytree_1.ManagedObject {
    get style() {
        if (this._svg == null) {
            return undefined;
        }
        return this._svg.style;
    }
    onActivate() {
        this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const solidPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        solidPath.setAttributeNS(null, "class", "solid");
        const dashedPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dashedPath.setAttributeNS(null, "class", "dashed");
        this._svg.setAttribute("aria-hidden", "true");
        this._svg.setAttribute("width", "100%");
        this._svg.setAttribute("height", "100%");
        this.cancelOnDeactivate(this.props.className.didChange.subscribe((className) => {
            this._svg.setAttributeNS(null, "class", className || "");
        }, true));
        const onClick = (e) => {
            const point = geometry_1.Point2.givenXY(e.clientX, e.clientY);
            this.props.onClick(point);
        };
        const onTouch = (e) => {
            const point = geometry_1.Point2.givenXY(e.touches[0].clientX, e.touches[0].clientY);
            this.props.onClick(point);
        };
        const onHover = () => {
            this.props.onHover();
        };
        const onLeave = () => {
            this.props.onLeave();
        };
        dashedPath.addEventListener("click", onClick);
        dashedPath.addEventListener("touch", onTouch);
        dashedPath.addEventListener("mouseover", onHover);
        dashedPath.addEventListener("mouseout", onLeave);
        this._svg.appendChild(solidPath);
        this._svg.appendChild(dashedPath);
        this.props.parentElement.appendChild(this._svg);
        this.cancelOnDeactivate(this.props.polygon.didChange.subscribe((polygon) => {
            if (polygon == null || polygon.points.length < 3) {
                return;
            }
            const pathString = polygon.toPathString(this.props.radius);
            dashedPath.setAttribute("d", pathString);
            solidPath.setAttribute("d", pathString);
        }, true));
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            this.props.parentElement.removeChild(this._svg);
            this._svg = undefined;
        }));
    }
}
exports.ManagedSvg = ManagedSvg;
//# sourceMappingURL=ManagedSvg.js.map