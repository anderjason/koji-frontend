import { Actor } from "skytree";
export interface DetailAccessoryProps {
    parentElement: HTMLElement;
    text?: string;
}
export declare class DetailAccessory extends Actor<DetailAccessoryProps> {
    onActivate(): void;
}
