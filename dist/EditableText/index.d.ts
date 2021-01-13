import { Observable, ObservableBase, ReadOnlyObservable, TypedEvent } from "@anderjason/observable";
import { Actor } from "skytree";
import { DisplayTextType } from "../DisplayText";
export interface EditableTextProps {
    displayType: DisplayTextType;
    parentElement: HTMLElement;
    placeholderLabel: string;
    isInvalid?: ObservableBase<boolean>;
    maxLength?: number | ObservableBase<number>;
    output?: Observable<string>;
}
export declare class EditableText extends Actor<EditableTextProps> {
    private _maxLength;
    private _isInvalid;
    private _isFocused;
    readonly isFocused: ReadOnlyObservable<boolean>;
    readonly didFocus: TypedEvent<void>;
    readonly output: Observable<string>;
    constructor(props: EditableTextProps);
    onActivate(): void;
}
