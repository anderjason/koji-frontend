import { Receipt } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { UndoContext } from "@anderjason/web";
import { Actor } from "skytree";
export interface ObservableStateProps {
    initialValue?: any;
}
export declare class ObservableState extends Actor<ObservableStateProps> {
    private _internalData;
    private _undoContext;
    private _pathBindings;
    onActivate(): void;
    get undoContext(): UndoContext;
    subscribe(valuePath: ValuePath, fn: (value: any) => void, includeLast?: boolean): Receipt;
    toOptionalValueGivenPath(path: ValuePath): any;
    update(path: ValuePath, newValue: any): void;
}
