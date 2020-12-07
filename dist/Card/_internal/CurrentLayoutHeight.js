"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentLayoutHeight = void 0;
const observable_1 = require("@anderjason/observable");
const skytree_1 = require("skytree");
class CurrentLayoutHeight extends skytree_1.Actor {
    constructor() {
        super(...arguments);
        this._output = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.output = observable_1.ReadOnlyObservable.givenObservable(this._output);
    }
    onActivate() {
        let receipt;
        this.cancelOnDeactivate(this.props.layout.didChange.subscribe((layout) => {
            if (receipt != null) {
                this.removeCancelOnDeactivate(receipt);
                receipt.cancel();
                receipt = undefined;
            }
            if (layout != null) {
                receipt = layout.cardHeight.didChange.subscribe((height) => {
                    this._output.setValue(height);
                }, true);
            }
        }));
    }
}
exports.CurrentLayoutHeight = CurrentLayoutHeight;
//# sourceMappingURL=CurrentLayoutHeight.js.map