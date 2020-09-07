"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiConfig = void 0;
const vcc_1 = require("@withkoji/vcc");
const skytree_1 = require("skytree");
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const time_1 = require("@anderjason/time");
class KojiConfig extends skytree_1.ManagedObject {
    constructor() {
        super();
        this.mode = observable_1.Observable.givenValue("view", observable_1.Observable.isStrictEqual);
        this._internalData = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._selectedPath = observable_1.Observable.ofEmpty(util_1.ValuePath.isEqual);
        this._pathBindings = new Set();
        this.onValueChanged = (path, newValue) => {
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
        this._updateKojiLater = time_1.RateLimitedFunction.givenDefinition({
            fn: async () => {
                this.sendPendingUpdates();
            },
            duration: time_1.Duration.givenSeconds(0.5),
        });
    }
    static get instance() {
        if (KojiConfig._instance == null) {
            KojiConfig._instance = new KojiConfig();
            KojiConfig._instance.init();
        }
        return KojiConfig._instance;
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
    initManagedObject() {
        if (this._instantRemixing != null) {
            this._internalData.setValue(this._instantRemixing.get(["general"]) || {});
            this._instantRemixing.onValueChanged((path, newValue) => {
                this.onValueChanged(path, newValue);
            });
            this._instantRemixing.onSetRemixing((isRemixing) => {
                if (isRemixing === false) {
                    this._selectedPath.setValue(undefined);
                    this.mode.setValue("view");
                }
                else {
                    this.mode.setValue("template");
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
    subscribe(vccPath, fn, includeLast = false) {
        const binding = this.addManagedObject(skytree_1.PathBinding.givenDefinition({
            input: this._internalData,
            path: vccPath,
        }));
        this._pathBindings.add(binding);
        const innerHandle = this.addReceipt(binding.output.didChange.subscribe((value) => {
            fn(value);
        }, includeLast));
        return observable_1.Receipt.givenCancelFunction(() => {
            this._pathBindings.delete(binding);
            innerHandle.cancel();
            this.removeReceipt(innerHandle);
            this.removeManagedObject(binding);
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
exports.KojiConfig = KojiConfig;
//# sourceMappingURL=index.js.map