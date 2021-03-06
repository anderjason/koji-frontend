import { ObservableBase, ReadOnlyObservable, ReadOnlyObservableArray } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { CardLayout } from "./_internal/CardLayout";
export declare type CardMode = "visible" | "hidden";
export interface CardProps {
    target: ThisOrParentElement<HTMLDivElement>;
    maxHeight?: number | ObservableBase<number>;
    mode?: CardMode | ObservableBase<CardMode>;
    anchorBottom?: boolean | ObservableBase<boolean>;
}
export interface AddPageOptions {
    title?: string | ObservableBase<string>;
    anchorBottom?: boolean | ObservableBase<boolean>;
    onRemoved?: () => void;
}
export declare const headerAreaHeight = 46;
export declare const cardTransitionDuration: Duration;
export declare const cardHeightAnimateDuration: Duration;
export declare const cardTransitionEasing = "cubic-bezier(.52,.01,.28,1)";
export declare class Card extends Actor<CardProps> {
    private _outer;
    private _layouts;
    private _slider;
    private _hiddenWrapper;
    private _baseLayout;
    private _maxHeight;
    private _mode;
    private _anchorBottom;
    private _selectedLayout;
    readonly layouts: ReadOnlyObservableArray<CardLayout>;
    readonly selectedLayout: ReadOnlyObservable<CardLayout>;
    constructor(props: CardProps);
    get element(): HTMLElement;
    get footerElement(): HTMLElement;
    get hiddenElement(): HTMLElement;
    onActivate(): void;
    addPage(options?: AddPageOptions): CardLayout;
}
