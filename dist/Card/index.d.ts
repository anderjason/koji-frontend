import { ObservableBase } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { CardLayout } from "./_internal/CardLayout";
export interface CardProps {
    target: ThisOrParentElement<HTMLDivElement>;
    maxHeight?: number | ObservableBase<number>;
}
export interface AddPageOptions {
    title?: string;
}
export declare const headerAreaHeight = 40;
export declare const totalVerticalPadding = 40;
export declare const cardTransitionDuration: Duration;
export declare const cardHeightAnimateDuration: Duration;
export declare const cardTransitionEasing = "cubic-bezier(.52,.01,.28,1)";
export declare class Card extends Actor<CardProps> {
    private _outer;
    private _layouts;
    private _slider;
    private _baseLayout;
    private _maxHeight;
    constructor(props: CardProps);
    get baseElement(): HTMLElement;
    onActivate(): void;
    addPage(options?: AddPageOptions): CardLayout;
}
