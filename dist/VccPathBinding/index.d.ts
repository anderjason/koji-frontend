import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
export interface VccPathBindingProps<T> {
    vccPath: ValuePath;
    output?: Observable<T>;
    convertToVcc?: (value: T) => any;
    convertFromVcc?: (value: any) => T;
}
export declare class VccPathBinding<T> extends Actor<VccPathBindingProps<T>> {
    readonly output: Observable<T>;
    constructor(props: VccPathBindingProps<T>);
    onActivate(): void;
}
