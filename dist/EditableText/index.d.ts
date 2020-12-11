import { Observable, ObservableBase, TypedEvent } from "@anderjason/observable";
import { Actor } from "skytree";
import { DisplayTextType } from "../DisplayText";
import { KojiTheme } from "../KojiAppearance";
export interface EditableTextProps {
    parentElement: HTMLElement;
    displayType: DisplayTextType;
    placeholderLabel: string;
    output?: Observable<string>;
    theme?: KojiTheme | Observable<KojiTheme>;
    maxLength?: number | ObservableBase<number>;
}
export declare class EditableText extends Actor<EditableTextProps> {
    private _maxLength;
    readonly didFocus: TypedEvent<void>;
    readonly output: Observable<string>;
    constructor(props: EditableTextProps);
    onActivate(): void;
}
