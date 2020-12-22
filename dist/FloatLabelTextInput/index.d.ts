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
    isInvalid?: ObservableBase<boolean>;
    persistentLabel?: string;
    placeholder?: string;
    inputType?: string;
    inputMode?: "text" | "decimal" | "email" | "numeric" | "search" | "tel" | "url";
    maxLength?: number | ObservableBase<number>;
}
export declare class FloatLabelTextInput<T> extends Actor<FloatLabelTextInputProps<T>> {
    private _isInvalid;
    private _maxLength;
    private _isFocused;
    readonly isFocused: ReadOnlyObservable<boolean>;
    private _input;
    get displayText(): string;
    constructor(props: FloatLabelTextInputProps<T>);
    onActivate(): void;
}
