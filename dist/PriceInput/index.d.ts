import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export interface PriceInputProps {
    parentElement: HTMLElement;
    usdCents: Observable<number>;
    persistentLabel: string;
}
export declare class PriceInput extends Actor<PriceInputProps> {
    onActivate(): void;
}
