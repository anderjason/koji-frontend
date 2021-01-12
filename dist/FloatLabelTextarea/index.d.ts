import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { TextInputBindingOverrideResult, TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
export interface FloatLabelTextareaProps<T> {
    displayTextGivenValue: (value: T) => string;
    overrideDisplayText?: (e: TextInputChangingData<T>) => string | TextInputBindingOverrideResult;
    parentElement: HTMLElement;
    value: Observable<T>;
    valueGivenDisplayText: (displayText: string) => T;
    persistentLabel?: string | ObservableBase<string>;
    placeholderLabel?: string | ObservableBase<string>;
    supportLabel?: string | ObservableBase<string>;
    errorLabel?: string | ObservableBase<string>;
    maxLength?: number | ObservableBase<number>;
    minRows?: number | ObservableBase<number>;
    maxRows?: number | ObservableBase<number>;
}
export declare class FloatLabelTextarea<T> extends Actor<FloatLabelTextareaProps<T>> {
    private _errorLabel;
    private _isFocused;
    private _maxLength;
    private _maxRows;
    private _minRows;
    private _persistentLabel;
    private _placeholderLabel;
    private _supportLabel;
    readonly isFocused: ReadOnlyObservable<boolean>;
    constructor(props: FloatLabelTextareaProps<T>);
    onActivate(): void;
}
