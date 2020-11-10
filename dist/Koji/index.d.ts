import { Observable, ReadOnlyObservable, TypedEvent } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ObservableState } from "@anderjason/web";
import { Actor } from "skytree";
import { EditorAttributes } from "@withkoji/vcc";
export declare class Koji extends Actor<void> {
    private static _instance;
    static get instance(): Koji;
    private _isRemixing;
    private _editorAttributes;
    private _vccData;
    private _selectedPath;
    private _instantRemixing;
    private _feedSdk;
    private _updateKojiLater;
    readonly willReceiveExternalData: TypedEvent<ValuePath>;
    readonly allPlaybackShouldStop: TypedEvent<void>;
    readonly isRemixing: ReadOnlyObservable<boolean>;
    readonly editorAttributes: ReadOnlyObservable<EditorAttributes>;
    private constructor();
    get vccData(): ObservableState;
    get selectedPath(): Observable<ValuePath>;
    get instantRemixing(): InstantRemixing;
    get feedSdk(): FeedSdk;
    onActivate(): void;
    sendPendingUpdates(): void;
    private onValueChanged;
}
