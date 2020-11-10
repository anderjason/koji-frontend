import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
export interface RemixModeButtonProps {
    parentElement: HTMLElement | Observable<HTMLElement>;
    output?: Observable<boolean>;
}
export declare class RemixModeButton extends Actor<RemixModeButtonProps> {
    readonly output: Observable<boolean>;
    constructor(props: RemixModeButtonProps);
    onActivate(): void;
    private onClick;
}
