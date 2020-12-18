import { Actor } from "skytree";
import { Observable, ObservableArray, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
export interface CardLayoutProps {
    layouts: ObservableArray<CardLayout>;
    parentElement: HTMLElement;
    maxHeight: ObservableBase<number>;
    title?: string;
    anchorBottom?: boolean;
}
export declare class CardLayout extends Actor<CardLayoutProps> {
    readonly listOrder: Observable<number>;
    protected _cardHeight: Observable<number>;
    readonly cardHeight: ReadOnlyObservable<number>;
    private _element;
    get element(): HTMLDivElement;
    onActivate(): void;
}
