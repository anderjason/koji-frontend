import { Actor } from "skytree";
export interface RemixModeButtonDefinition {
    parentElement: HTMLElement;
}
export declare class RemixModeButton extends Actor<RemixModeButtonDefinition> {
    onActivate(): void;
    private onClick;
}
