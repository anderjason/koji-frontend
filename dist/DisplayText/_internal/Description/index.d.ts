import { Observable, ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
export interface DescriptionInputProps {
    parentElement: HTMLElement;
    text: ObservableBase<string>;
}
export declare class Description extends Actor<DescriptionInputProps> {
    readonly isExpanded: Observable<boolean>;
    onActivate(): void;
}
