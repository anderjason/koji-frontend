import { Observable } from "@anderjason/observable";
import { TextInputChangingData } from "@anderjason/web/dist/TextInputBinding";
import { Actor } from "skytree";
export interface FloatLabelTextInputProps<T> {
    displayTextGivenValue: (value: T) => string;
    overrideDisplayText?: (e: TextInputChangingData<T>) => string;
    parentElement: HTMLElement;
    value: Observable<T>;
    valueGivenDisplayText: (displayText: string) => T;
    persistentLabel?: string;
    placeholder?: string;
}
export declare class FloatLabelTextInput<T> extends Actor<FloatLabelTextInputProps<T>> {
    constructor(props: FloatLabelTextInputProps<T>);
    onActivate(): void;
}
