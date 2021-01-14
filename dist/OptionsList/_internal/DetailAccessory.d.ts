import { Actor } from "skytree";
export interface DetailAccessoryProps {
    parentElement: HTMLElement;
    summaryText?: string;
}
export declare class DetailAccessory extends Actor<DetailAccessoryProps> {
    onActivate(): void;
}
