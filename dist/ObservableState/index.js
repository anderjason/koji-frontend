"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableState = void 0;
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
class ObservableState extends skytree_1.Actor {
    constructor() {
        super(...arguments);
        this._state = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.state = observable_1.ReadOnlyObservable.givenObservable(this._state);
        this._pathBindings = new Set();
    }
    onActivate() {
        this._undoContext = new web_1.UndoContext(this.props.initialState || {}, 10);
        this.cancelOnDeactivate(this._undoContext.currentStep.didChange.subscribe((undoStep) => {
            this._state.setValue(undoStep);
        }, true));
    }
    get undoContext() {
        return this._undoContext;
    }
    subscribe(valuePath, fn, includeLast = false) {
        const binding = this.addActor(new skytree_1.PathBinding({
            input: this._state,
            path: valuePath,
        }));
        this._pathBindings.add(binding);
        const innerHandle = this.cancelOnDeactivate(binding.output.didChange.subscribe((value) => {
            fn(value);
        }, includeLast));
        return new observable_1.Receipt(() => {
            this._pathBindings.delete(binding);
            innerHandle.cancel();
            this.removeCancelOnDeactivate(innerHandle);
            this.removeActor(binding);
        });
    }
    toOptionalValueGivenPath(path) {
        return util_1.ObjectUtil.optionalValueAtPathGivenObject(this._state.value, path);
    }
    update(path, newValue) {
        const obj = util_1.ObjectUtil.objectWithValueAtPath(this._state.value, path, newValue);
        this._state.setValue(obj);
    }
}
exports.ObservableState = ObservableState;
//# sourceMappingURL=index.js.map