import { Actor } from "skytree";
export interface PublishButtonProps {
    parentElement: HTMLElement;
    onClick: () => string;
}
export declare class PublishButton extends Actor<PublishButtonProps> {
    onActivate(): void;
}
