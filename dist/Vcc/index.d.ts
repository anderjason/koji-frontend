import { Observable, Receipt, TypedEvent } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { Actor } from "skytree";
export declare type KojiMode = "view" | "generator" | "template";
export declare class Vcc extends Actor<void> {
    private static _instance;
    static get instance(): Vcc;
    readonly mode: Observable<KojiMode>;
    readonly willReceiveExternalData: TypedEvent<ValuePath>;
    readonly allPlaybackShouldStop: TypedEvent<void>;
    private _internalData;
    private _undoContext;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    private _pathBindings;
    private constructor();
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    onActivate(): void;
    subscribe(vccPath: ValuePath, fn: (value: any) => void, includeLast?: boolean): Receipt;
    toOptionalValueGivenPath(path: ValuePath): any;
    update(path: ValuePath, newValue: any, immediate?: boolean): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}
