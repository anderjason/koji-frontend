import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
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
    private _isContentExpandable;
    readonly isContentExpandable: ReadOnlyObservable<boolean>;
    onActivate(): void;
}
