import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ManagedObject } from "skytree";
import { Observable, Receipt } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
export declare type KojiMode = "view" | "generator" | "template";
export declare class KojiConfig extends ManagedObject {
    private static _instance;
    static get instance(): KojiConfig;
    readonly mode: Observable<KojiMode>;
    private _internalData;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    private _pathBindings;
    private constructor();
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    initManagedObject(): void;
    subscribe(vccPath: ValuePath, fn: (value: any) => void, includeLast?: boolean): Receipt;
    toOptionalValueGivenPath(path: ValuePath): any;
    update(path: ValuePath, newValue: any, immediate?: boolean): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}
