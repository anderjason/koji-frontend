import { Actor } from "skytree";
import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
export interface IntegerInputProps {
    parentElement: HTMLElement;
    value: Observable<number>;
    persistentLabel?: string | ObservableBase<string>;
    placeholderLabel?: string | ObservableBase<string>;
    supportLabel?: string | ObservableBase<string>;
    errorLabel?: string | ObservableBase<string>;
}
export declare class IntegerInput extends Actor<IntegerInputProps> {
    private _textInput;
    get isFocused(): ReadOnlyObservable<boolean>;
    onActivate(): void;
}
