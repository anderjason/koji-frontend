import { ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
export interface IntegerInputProps {
    parentElement: HTMLElement;
    vccPath: ValuePath;
    persistentLabel: string;
    placeholder: string;
}
export declare class IntegerInput extends Actor<IntegerInputProps> {
    onActivate(): void;
}
