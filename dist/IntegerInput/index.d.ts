import { Actor } from "skytree";
import { Observable } from "@anderjason/observable";
export interface IntegerInputProps {
    parentElement: HTMLElement;
    value: Observable<number>;
    persistentLabel: string;
    placeholder: string;
}
export declare class IntegerInput extends Actor<IntegerInputProps> {
    onActivate(): void;
}
