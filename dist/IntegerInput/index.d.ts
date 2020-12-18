import { Actor } from "skytree";
import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
export interface IntegerInputProps {
    parentElement: HTMLElement;
    value: Observable<number>;
    persistentLabel: string;
    placeholder: string;
    isInvalid?: ObservableBase<boolean>;
}
export declare class IntegerInput extends Actor<IntegerInputProps> {
    private _textInput;
    get isFocused(): ReadOnlyObservable<boolean>;
    onActivate(): void;
}
