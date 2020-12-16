"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KojiTools = void 0;
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const vcc_1 = require("@withkoji/vcc");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
class KojiTools extends skytree_1.Actor {
    constructor() {
        super();
        this._currentMode = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._sessionMode = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this._selectedPath = observable_1.Observable.ofEmpty(util_1.ValuePath.isEqual);
        this.willReceiveExternalData = new observable_1.TypedEvent();
        this.allPlaybackShouldStop = new observable_1.TypedEvent();
        this.currentMode = observable_1.ReadOnlyObservable.givenObservable(this._currentMode);
        this.sessionMode = observable_1.ReadOnlyObservable.givenObservable(this._sessionMode);
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
                this._sessionMode.setValue("screenshot");
                this._currentMode.setValue("screenshot");
            }
            else if (query["context"] === "about") {
                this._sessionMode.setValue("about");
                this._currentMode.setValue("about");
            }
            else if (query["context"] === "admin") {
                this._sessionMode.setValue("admin");
                this._currentMode.setValue("admin");
            }
            else {
                this._sessionMode.setValue("view");
                this._currentMode.setValue("view");
            }
        }
    }
    static get instance() {
        if (KojiTools._instance == null) {
            KojiTools._instance = new KojiTools();
            KojiTools._instance.activate();
        }
        if (typeof window !== "undefined") {
            window.koji = KojiTools._instance;
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
        this.cancelOnDeactivate(this._vccData.willChange.subscribe(change => {
            if (this._instantRemixing == null) {
                return;
            }
            this._instantRemixing.onSetValue(["general", ...change.valuePath.toParts()], change.newValue, true);
        }));
        if (this._instantRemixing != null) {
            this._instantRemixing.onValueChanged((path, newValue) => {
                this.onValueChanged(path, newValue);
            });
            this._instantRemixing.onSetRemixing((isRemixing, editorAttributes) => {
                const sessionMode = this._sessionMode.value;
                if (sessionMode === "about" ||
                    sessionMode === "screenshot" ||
                    sessionMode === "admin") {
                    return;
                }
                if ((editorAttributes === null || editorAttributes === void 0 ? void 0 : editorAttributes.mode) === "edit") {
                    this._sessionMode.setValue("edit");
                }
                else if ((editorAttributes === null || editorAttributes === void 0 ? void 0 : editorAttributes.mode) === "new") {
                    this._sessionMode.setValue("remix");
                }
                if (isRemixing === false) {
                    this._selectedPath.setValue(undefined);
                    this._currentMode.setValue("view");
                }
                else {
                    this._currentMode.setValue(this._sessionMode.value);
                }
            });
            this._instantRemixing.onSetActivePath((externalPath) => {
                if (externalPath == null) {
                    this._selectedPath.setValue(undefined);
                }
                else {
                    if (externalPath[0] !== "general") {
                        return;
                    }
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
            this.cancelOnDeactivate(web_1.ScrollArea.willScroll.subscribe(() => {
                this._feedSdk.requestCancelTouch();
            }));
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
}
exports.KojiTools = KojiTools;
//# sourceMappingURL=index.js.map