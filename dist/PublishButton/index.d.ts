import { Actor } from "skytree";
import { ObservableBase } from "@anderjason/observable";
export interface PublishButtonReadyMode {
    type: "ready";
}
export interface PublishButtonBusyMode {
    type: "busy";
}
export interface PublishButtonErrorMode {
    type: "error";
    errorText: string;
}
export declare type PublishButtonMode = PublishButtonReadyMode | PublishButtonBusyMode | PublishButtonErrorMode;
export interface PublishButtonProps {
    parentElement: HTMLElement;
    onClick: () => void;
    mode: PublishButtonMode | ObservableBase<PublishButtonMode>;
}
export declare class PublishButton extends Actor<PublishButtonProps> {
    private _mode;
    constructor(props: PublishButtonProps);
    onActivate(): void;
}
