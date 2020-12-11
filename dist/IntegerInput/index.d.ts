import { Actor } from "skytree";
import { Observable, ObservableBase } from "@anderjason/observable";
export interface IntegerInputProps {
    parentElement: HTMLElement;
    value: Observable<number>;
    persistentLabel: string;
    placeholder: string;
    isInvalid?: ObservableBase<boolean>;
}
export declare class IntegerInput extends Actor<IntegerInputProps> {
    onActivate(): void;
}
