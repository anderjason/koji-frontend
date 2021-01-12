import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Money } from "@anderjason/money";
export interface MoneyInputProps {
    parentElement: HTMLElement;
    value: Observable<Money>;
    allowEmpty?: boolean;
    errorLabel?: string | ObservableBase<string>;
    maxValue?: Money;
    persistentLabel?: string | ObservableBase<string>;
    placeholderLabel?: string | ObservableBase<string>;
    supportLabel?: string | ObservableBase<string>;
}
export declare function shouldRejectInput(input: string): boolean;
export declare class MoneyInput extends Actor<MoneyInputProps> {
    private _textInput;
    get isFocused(): ReadOnlyObservable<boolean>;
    onActivate(): void;
}
