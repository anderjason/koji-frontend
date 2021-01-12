import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { TextInputBindingOverrideResult, TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
export interface FloatLabelTextInputProps<T> {
    displayTextGivenValue: (value: T) => string;
    overrideDisplayText?: (e: TextInputChangingData<T>) => string | TextInputBindingOverrideResult;
    parentElement: HTMLElement;
    value: Observable<T>;
    valueGivenDisplayText: (displayText: string) => T;
    shadowTextGivenValue?: (value: T) => string;
    applyShadowTextOnBlur?: boolean;
    persistentLabel?: string | ObservableBase<string>;
    placeholderLabel?: string | ObservableBase<string>;
    supportLabel?: string | ObservableBase<string>;
    errorLabel?: string | ObservableBase<string>;
    inputType?: string;
    inputMode?: "text" | "decimal" | "email" | "numeric" | "search" | "tel" | "url";
    maxLength?: number | ObservableBase<number>;
}
export declare class FloatLabelTextInput<T> extends Actor<FloatLabelTextInputProps<T>> {
    private _errorLabel;
    private _input;
    private _isFocused;
    private _maxLength;
    private _persistentLabel;
    private _placeholderLabel;
    private _supportLabel;
    readonly isFocused: ReadOnlyObservable<boolean>;
    get displayText(): string;
    constructor(props: FloatLabelTextInputProps<T>);
    onActivate(): void;
}
