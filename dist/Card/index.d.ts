import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
export interface CardProps {
    element: ThisOrParentElement<HTMLDivElement>;
}
export declare class Card extends Actor<CardProps> {
    private _element;
    get element(): HTMLElement;
    onActivate(): void;
}