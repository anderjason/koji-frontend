import { Observable, ReadOnlyObservable } from "@anderjason/observable";
import { TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
export interface FloatLabelTextInputProps<T> {
    displayTextGivenValue: (value: T) => string;
    overrideDisplayText?: (e: TextInputChangingData<T>) => string;
    parentElement: HTMLElement;
    value: Observable<T>;
    valueGivenDisplayText: (displayText: string) => T;
    shadowTextGivenValue?: (value: T) => string;
    applyShadowTextOnBlur?: boolean;
    persistentLabel?: string;
    placeholder?: string;
    inputType?: string;
}
export declare class FloatLabelTextInput<T> extends Actor<FloatLabelTextInputProps<T>> {
    private _isFocused;
    readonly isFocused: ReadOnlyObservable<boolean>;
    constructor(props: FloatLabelTextInputProps<T>);
    onActivate(): void;
}
