"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayGivenArrayLike = void 0;
function isIntLike(input) {
    if (typeof input === "number") {
        return true;
    }
    return Number.isInteger(parseFloat(input));
}
function arrayGivenArrayLike(input) {
    // sometimes Koji VCCs contain "array-like" objects, where
    // the keys are all numbers. In other words, the object looks
    // like an array, but isn't one.
    // For example: {"0": "value", "1": "value", "2": "value"}
    // This function attempts to detect those objects and
    // convert them to actual JS arrays
    if (input == null) {
        return input;
    }
    if (Array.isArray(input)) {
        return input;
    }
    if (typeof input !== "object") {
        return input;
    }
    const everyKeyIsInt = Object.keys(input).every((key) => isIntLike(key));
    if (!everyKeyIsInt || Object.keys(input).length === 0) {
        return input;
    }
    const result = [];
    Object.keys(input).forEach((key) => {
        result[parseInt(key)] = input[key];
    });
    return result;
}
exports.arrayGivenArrayLike = arrayGivenArrayLike;
//# sourceMappingURL=arrayGivenArrayLike.js.map