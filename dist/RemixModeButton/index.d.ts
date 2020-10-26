import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export interface RemixModeButtonDefinition {
    parentElement: HTMLElement | Observable<HTMLElement>;
}
export declare class RemixModeButton extends Actor<RemixModeButtonDefinition> {
    onActivate(): void;
    private onClick;
}
