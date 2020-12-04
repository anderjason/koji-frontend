"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiTools = void 0;
const observable_1 = require("@anderjason/observable");
const time_1 = require("@anderjason/time");
const util_1 = require("@anderjason/util");
const vcc_1 = require("@withkoji/vcc");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
class KojiTools extends skytree_1.Actor {
    constructor() {
        super();
        this._isRemixingNow = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._sessionType = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._selectedPath = observable_1.Observable.ofEmpty(util_1.ValuePath.isEqual);
        this.willReceiveExternalData = new observable_1.TypedEvent();
        this.allPlaybackShouldStop = new observable_1.TypedEvent();
        this.isRemixingNow = observable_1.ReadOnlyObservable.givenObservable(this._isRemixingNow);
        this.onValueChanged = (path, newValue) => {
            const valuePath = util_1.ValuePath.givenParts(path.slice(1));
            this.willReceiveExternalData.emit(valuePath);
            this._vccData.update(valuePath, newValue);
        };
        if (typeof window !== "undefined") {
            this._instantRemixing = new vcc_1.InstantRemixing();
            this._feedSdk = new vcc_1.FeedSdk();
            const query = web_1.LocationUtil.objectOfCurrentQueryString();
            if (query["koji-screenshot"] == "1") {
                this._sessionType.setValue("screenshot");
            }
            else if (query["context"] === "about") {
                this._sessionType.setValue("about");
            }
            else if (query["context"] === "admin") {
                this._sessionType.setValue("admin");
            }
            else {
                this._sessionType.setValue("view");
            }
        }
        this._updateKojiLater = new time_1.Debounce({
            fn: () => {
                this.sendPendingUpdates();
            },
            duration: time_1.Duration.givenSeconds(0.25),
        });
    }
    static get instance() {
        if (KojiTools._instance == null) {
            KojiTools._instance = new KojiTools();
            KojiTools._instance.activate();
        }
        return KojiTools._instance;
    }
    get vccData() {
        return this._vccData;
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
    onActivate() {
        var _a;
        this._vccData = this.addActor(new web_1.ObservableState({
            initialState: (_a = this._instantRemixing) === null || _a === void 0 ? void 0 : _a.get(["general"]),
        }));
        this.cancelOnDeactivate(this._vccData.state.didChange.subscribe(() => {
            this._updateKojiLater.invoke();
        }));
        if (this._instantRemixing != null) {
            this._instantRemixing.onValueChanged((path, newValue) => {
                this.onValueChanged(path, newValue);
            });
            this._instantRemixing.onSetRemixing((isRemixing, editorAttributes) => {
                if (this._sessionType.value === "view") {
                    if ((editorAttributes === null || editorAttributes === void 0 ? void 0 : editorAttributes.mode) === "edit") {
                        this._sessionType.setValue("edit");
                    }
                    else if ((editorAttributes === null || editorAttributes === void 0 ? void 0 : editorAttributes.mode) === "new") {
                        this._sessionType.setValue("remix");
                    }
                }
                if (isRemixing === false) {
                    this._selectedPath.setValue(undefined);
                    this._isRemixingNow.setValue(false);
                }
                else {
                    this._isRemixingNow.setValue(true);
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
                this._instantRemixing.onPresentControl(externalPath.toParts(), { preventNavigation: true });
            }
            else {
                this._instantRemixing.onPresentControl(undefined);
            }
        });
    }
    sendPendingUpdates() {
        this._updateKojiLater.clear();
        if (this._instantRemixing != null) {
            const currentValue = this._instantRemixing.get(["general"]);
            if (util_1.ObjectUtil.objectIsDeepEqual(currentValue, this._vccData.state.value)) {
                return; // nothing to update
            }
            this._instantRemixing.onSetValue(["general"], util_1.ObjectUtil.objectWithDeepMerge({}, this._vccData.state.value), // make sure to pass a clone to instant remixing
            true);
        }
    }
}
exports.KojiTools = KojiTools;
//# sourceMappingURL=index.js.map