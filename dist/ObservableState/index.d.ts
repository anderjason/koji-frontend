import { ReadOnlyObservable, Receipt } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { UndoContext } from "@anderjason/web";
import { Actor } from "skytree";
import { ObservableStateBinding } from "./_internal/ObservableStateBinding";
export interface ObservableStateProps {
    initialState?: any;
}
export declare class ObservableState extends Actor<ObservableStateProps> {
    private _state;
    readonly state: ReadOnlyObservable<unknown>;
    private _undoContext;
    private _pathBindings;
    onActivate(): void;
    get undoContext(): UndoContext;
    subscribe(valuePath: ValuePath, fn: (value: any) => void, includeLast?: boolean): Receipt;
    toBindingGivenPath<T>(valuePath: ValuePath): ObservableStateBinding<T>;
    toOptionalValueGivenPath(path: ValuePath): any;
    update(path: ValuePath, newValue: any): void;
}
