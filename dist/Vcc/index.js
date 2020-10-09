"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vcc = void 0;
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const vcc_1 = require("@withkoji/vcc");
const skytree_1 = require("skytree");
class Vcc extends skytree_1.Actor {
    constructor() {
        super();
        this.mode = observable_1.Observable.givenValue("view", observable_1.Observable.isStrictEqual);
        this.willReceiveExternalData = new observable_1.TypedEvent();
        this.allPlaybackShouldStop = new observable_1.TypedEvent();
        this._internalData = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._selectedPath = observable_1.Observable.ofEmpty(util_1.ValuePath.isEqual);
        this._pathBindings = new Set();
        this.onValueChanged = (path, newValue) => {
            const valuePath = util_1.ValuePath.givenParts(path);
            this.willReceiveExternalData.emit(valuePath);
            const internalPath = path.slice(1);
            let internalData = this._internalData.value;
            if (internalPath.length === 0) {
                internalData = newValue;
            }
            else {
                internalData = util_1.ObjectUtil.objectWithValueAtPath(internalData, internalPath, newValue);
            }
            const newInternalData = Object.assign({}, internalData);
            this._internalData.setValue(newInternalData);
        };
        if (typeof window !== "undefined") {
            this._instantRemixing = new vcc_1.InstantRemixing();
            this._feedSdk = new vcc_1.FeedSdk();
        }
        this._updateKojiLater = new time_1.Debounce({
            fn: () => {
                this.sendPendingUpdates();
            },
            duration: time_1.Duration.givenSeconds(0.25),
        });
    }
    static get instance() {
        if (Vcc._instance == null) {
            Vcc._instance = new Vcc();
            Vcc._instance.activate();
        }
        return Vcc._instance;
    }
    get selectedPath() {
        return this._selectedPath;
    }
    get instantRemixing() {
        return this._instantRemixing;
    }
    get feedSdk() {
        return this._feedSdk;
    }
    // get canUndo(): ReadOnlyObservable<boolean> {
    //   return this._undoManager.canUndo;
    // }
    // get canRedo(): ReadOnlyObservable<boolean> {
    //   return this._undoManager.canRedo;
    // }
    onActivate() {
        var _a;
        this._undoContext = new web_1.UndoContext(((_a = this._instantRemixing) === null || _a === void 0 ? void 0 : _a.get(["general"])) || {}, 10);
        this._undoContext.currentStep.didChange.subscribe((undoStep) => {
            this._internalData.setValue(undoStep);
        }, true);
        if (this._instantRemixing != null) {
            this._instantRemixing.onValueChanged((path, newValue) => {
                this.onValueChanged(path, newValue);
            });
            let previousEditMode = undefined;
            this._instantRemixing.onSetRemixing((isRemixing) => {
                if (isRemixing === false) {
                    if (this.mode.value !== "view") {
                        previousEditMode = this.mode.value;
                    }
                    this._selectedPath.setValue(undefined);
                    this.mode.setValue("view");
                }
                else {
                    this.mode.setValue(previousEditMode || "template");
                }
            });
            this._instantRemixing.onSetActivePath((externalPath) => {
                if (externalPath == null) {
                    this._selectedPath.setValue(undefined);
                }
                else {
                    const internalPath = externalPath.slice(1);
                    this._selectedPath.setValue(util_1.ValuePath.givenParts(internalPath));
                }
            });
            this._instantRemixing.ready();
        }
        if (this._feedSdk != null) {
            this._feedSdk.load();
            this._feedSdk.onPlaybackStateChanged((isPlaying) => {
                if (!isPlaying) {
                    this.allPlaybackShouldStop.emit();
                }
            });
        }
        this._selectedPath.didChange.subscribe((path) => {
            if (path != null) {
                const externalPath = util_1.ValuePath.givenParts([
                    "general",
                    ...path.toParts(),
                ]);
                this._instantRemixing.onPresentControl(externalPath.toParts());
            }
            else {
                this._instantRemixing.onPresentControl(undefined);
            }
        });
    }
    // createUndoStep(): void {
    //   this._undoManager.addStep(this._internalData.value);
    // }
    // clearUndoSteps(): void {
    //   this._undoManager.clearSteps();
    // }
    // undo(): void {
    //   if (this._undoManager.undo()) {
    //     this._updateKojiLater.invoke();
    //   }
    // }
    // redo(): void {
    //   if (this._undoManager.redo()) {
    //     this._updateKojiLater.invoke();
    //   }
    // }
    subscribe(vccPath, fn, includeLast = false) {
        const binding = this.addActor(new skytree_1.PathBinding({
            input: this._internalData,
            path: vccPath,
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
        return util_1.ObjectUtil.optionalValueAtPathGivenObject(this._internalData.value, path);
    }
    update(path, newValue, immediate = false) {
        const obj = util_1.ObjectUtil.objectWithValueAtPath(this._internalData.value, path, newValue);
        this._internalData.setValue(obj);
        if (immediate == true) {
            this.sendPendingUpdates();
        }
        else {
            this._updateKojiLater.invoke();
        }
    }
    sendPendingUpdates() {
        this._updateKojiLater.clear();
        if (this._instantRemixing != null) {
            this._instantRemixing.onSetValue(["general"], this._internalData.value, true);
        }
    }
}
exports.Vcc = Vcc;
//# sourceMappingURL=index.js.map