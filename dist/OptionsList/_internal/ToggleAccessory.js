"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleAccessory = void 0;
const skytree_1 = require("skytree");
const __1 = require("../..");
const observable_1 = require("@anderjason/observable");
class ToggleAccessory extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this._isToggleActive = observable_1.Observable.givenValue(this.props.defaultValue || false);
    }
    forceToggleValue() {
        this._isToggleActive.setValue(!this._isToggleActive.value);
    }
    onActivate() {
        this.addActor(new __1.ToggleButton({
            target: {
                type: "parentElement",
                parentElement: this.props.parentElement,
            },
            isActive: this._isToggleActive
        }));
        this.cancelOnDeactivate(this._isToggleActive.didChange.subscribe(isActive => {
            this.props.onChange(isActive);
        }));
    }
}
exports.ToggleAccessory = ToggleAccessory;
//# sourceMappingURL=ToggleAccessory.js.map