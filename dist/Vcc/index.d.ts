import { Observable, TypedEvent } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { Actor } from "skytree";
import { ObservableState } from "../ObservableState";
export declare type KojiMode = "view" | "generator" | "template";
export declare class Vcc extends Actor<void> {
    private static _instance;
    static get instance(): Vcc;
    readonly mode: Observable<KojiMode>;
    readonly willReceiveExternalData: TypedEvent<ValuePath>;
    readonly allPlaybackShouldStop: TypedEvent<void>;
    private _observableState;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    private constructor();
    get observableState(): ObservableState;
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    onActivate(): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}
