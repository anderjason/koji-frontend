import { Observable, ObservableBase } from "@anderjason/observable";
import { Actor } from "skytree";
export interface DescriptionInputProps {
    parentElement: HTMLElement;
    text: ObservableBase<string>;
}
export interface WordAndWhitespace {
    word: string;
    trailingWhitespace: string;
}
export declare function wordsAndWhitespaceGivenString(input: string): WordAndWhitespace[];
export declare class Description extends Actor<DescriptionInputProps> {
    readonly isExpanded: Observable<boolean>;
    onActivate(): void;
}
