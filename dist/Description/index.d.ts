import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export interface DescriptionInputProps {
    parentElement: HTMLElement;
    text: Observable<string>;
}
export declare class Description extends Actor<DescriptionInputProps> {
    readonly isExpanded: Observable<boolean>;
    onActivate(): void;
}
