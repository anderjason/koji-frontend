import { Observable, ReadOnlyObservable } from "@anderjason/observable";
import { TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
export interface FloatLabelTextareaProps<T> {
    displayTextGivenValue: (value: T) => string;
    overrideDisplayText?: (e: TextInputChangingData<T>) => string;
    parentElement: HTMLElement;
    value: Observable<T>;
    valueGivenDisplayText: (displayText: string) => T;
    persistentLabel?: string;
    placeholder?: string;
    maxLength?: number;
}
export declare class FloatLabelTextarea<T> extends Actor<FloatLabelTextareaProps<T>> {
    private _isFocused;
    readonly isFocused: ReadOnlyObservable<boolean>;
    constructor(props: FloatLabelTextareaProps<T>);
    onActivate(): void;
}
