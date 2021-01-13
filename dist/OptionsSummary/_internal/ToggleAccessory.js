"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleAccessory = void 0;
const skytree_1 = require("skytree");
const __1 = require("../..");
class ToggleAccessory extends skytree_1.Actor {
    onActivate() {
        this.addActor(new __1.ToggleButton({
            parentElement: this.props.parentElement,
            output: this.props.isActive
        }));
    }
}
exports.ToggleAccessory = ToggleAccessory;
//# sourceMappingURL=ToggleAccessory.js.map