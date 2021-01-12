import { Actor } from "skytree";
import { Observable, ObservableArray, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
export interface CardLayoutProps {
    layouts: ObservableArray<CardLayout>;
    parentElement: HTMLElement;
    maxHeight: ObservableBase<number>;
    title?: string | ObservableBase<string>;
    anchorBottom?: boolean | ObservableBase<boolean>;
}
export declare class CardLayout extends Actor<CardLayoutProps> {
    readonly listOrder: Observable<number>;
    protected _cardHeight: Observable<number>;
    readonly cardHeight: ReadOnlyObservable<number>;
    readonly title: ObservableBase<string>;
    private _contentElement;
    private _footerElement;
    get element(): HTMLDivElement;
    get footerElement(): HTMLDivElement;
    constructor(props: CardLayoutProps);
    onActivate(): void;
}
