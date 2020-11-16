"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgStyleGivenStrokeWidth = void 0;
const web_1 = require("@anderjason/web");
const svgStylesByStrokeWidth = new Map();
function svgStyleGivenStrokeWidth(strokeWidth) {
    if (svgStylesByStrokeWidth.has(strokeWidth)) {
        return svgStylesByStrokeWidth.get(strokeWidth);
    }
    const dynamicSvgStyle = web_1.ElementStyle.givenDefinition({
        elementDescription: "DynamicSvg",
        css: `
      left: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      transition: 0.5s ease opacity;
  
      path.dashed {
        cursor: pointer;
        fill: currentColor;
        fill-opacity: 0.1;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-opacity: 1;
        stroke-dasharray: ${strokeWidth * 2.5}px ${strokeWidth * 3}px;
        stroke-width: ${strokeWidth}px;
        transition: 0.2s ease stroke-opacity;
      }

      path.solid {
        stroke: #000;
        stroke-opacity: 0.3;
        stroke-width: ${strokeWidth * 0.8}px;
        stroke-linecap: round;
        fill: none;
        transition: 0.2s ease stroke-opacity;
      }
    `,
        modifiers: {
            isAnimated: `
        @keyframes dash {
          to {
            stroke-dashoffset: ${strokeWidth * 55};
          }
        }

        path.dashed {
          animation: dash 3s linear infinite;
          fill-opacity: 0.2;
          pointer-events: all;
        }

        &:hover path.dashed {
          fill-opacity: 0.3;
        }

        &:hover path.solid {
          stroke-opacity: 0.8;
        }
      `,
        },
    });
    svgStylesByStrokeWidth.set(strokeWidth, dynamicSvgStyle);
    return dynamicSvgStyle;
}
exports.svgStyleGivenStrokeWidth = svgStyleGivenStrokeWidth;
//# sourceMappingURL=svgStyleGivenStrokeWidth.js.map