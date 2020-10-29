import { Actor } from "skytree";
import { Observable } from "@anderjason/observable";
export interface ConfirmationPromptProps {
    parentElement: HTMLElement | Observable<HTMLElement>;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    isConfirmDestructive: boolean;
}
export declare class ConfirmationPrompt extends Actor<ConfirmationPromptProps> {
    constructor(props: ConfirmationPromptProps);
    onActivate(): void;
}
