import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Money } from "@anderjason/money";
export interface MoneyInputProps {
    parentElement: HTMLElement;
    value: Observable<Money>;
    persistentLabel: string;
    placeholderLabel?: string;
    maxValue?: Money;
    allowEmpty?: boolean;
    isInvalid?: ObservableBase<boolean>;
}
export declare class MoneyInput extends Actor<MoneyInputProps> {
    private _textInput;
    get isFocused(): ReadOnlyObservable<boolean>;
    onActivate(): void;
}
