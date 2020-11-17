import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Money } from "@anderjason/money";
export interface PriceInputProps {
    parentElement: HTMLElement;
    value: Observable<Money>;
    persistentLabel: string;
}
export declare class PriceInput extends Actor<PriceInputProps> {
    onActivate(): void;
}
