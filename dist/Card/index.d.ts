import { ObservableBase } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { CardLayout } from "./_internal/CardLayout";
export declare type CardMode = "visible" | "hidden";
export interface CardProps {
    target: ThisOrParentElement<HTMLDivElement>;
    maxHeight?: number | ObservableBase<number>;
    mode?: CardMode | ObservableBase<CardMode>;
}
export interface AddPageOptions {
    title?: string | ObservableBase<string>;
    anchorBottom?: boolean;
}
export declare const headerAreaHeight = 40;
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
    constructor(props: CardProps);
    get baseElement(): HTMLElement;
    get baseFooterElement(): HTMLElement;
    get hiddenElement(): HTMLElement;
    onActivate(): void;
    addPage(options?: AddPageOptions): CardLayout;
}
