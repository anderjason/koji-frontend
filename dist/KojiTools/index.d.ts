import { Observable, ReadOnlyObservable, TypedEvent } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ObservableState } from "@anderjason/web";
import { Actor } from "skytree";
export declare type KojiSessionType = "about" | "admin" | "edit" | "remix" | "screenshot" | "view";
export declare class KojiTools extends Actor<void> {
    private static _instance;
    static get instance(): KojiTools;
    private _isRemixingNow;
    private _sessionType;
    private _vccData;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    readonly willReceiveExternalData: TypedEvent<ValuePath>;
    readonly allPlaybackShouldStop: TypedEvent<void>;
    readonly isRemixingNow: ReadOnlyObservable<boolean>;
    private constructor();
    get vccData(): ObservableState;
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    onActivate(): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}
