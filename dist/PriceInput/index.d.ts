import { ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
export interface PriceInputProps {
    parentElement: HTMLElement;
    vccPath: ValuePath;
    persistentLabel: string;
}
export declare class PriceInput extends Actor<PriceInputProps> {
    onActivate(): void;
}
