"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleAccessory = void 0;
const skytree_1 = require("skytree");
const __1 = require("../..");
const observable_1 = require("@anderjason/observable");
class ToggleAccessory extends skytree_1.Actor {
    onActivate() {
        const { propertyName, valuesByPropertyName } = this.props;
        const isToggleActive = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.addActor(new __1.ToggleButton({
            target: {
                type: "parentElement",
                parentElement: this.props.parentElement,
            },
            isToggleActive
        }));
        this.cancelOnDeactivate(isToggleActive.didChange.subscribe(value => {
            valuesByPropertyName.setValue(propertyName, value);
        }));
        this.cancelOnDeactivate(valuesByPropertyName.didChange.subscribe(() => {
            isToggleActive.setValue(valuesByPropertyName.toOptionalValueGivenKey(propertyName) == true);
        }, true));
    }
}
exports.ToggleAccessory = ToggleAccessory;
//# sourceMappingURL=ToggleAccessory.js.map