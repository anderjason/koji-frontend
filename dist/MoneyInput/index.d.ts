import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Money } from "@anderjason/money";
export interface MoneyInputProps {
    parentElement: HTMLElement;
    value: Observable<Money>;
    persistentLabel: string;
    maxValue?: Money;
}
export declare class MoneyInput extends Actor<MoneyInputProps> {
    onActivate(): void;
}
