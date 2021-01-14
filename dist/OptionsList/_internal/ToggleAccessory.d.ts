import { Actor } from "skytree";
export interface ToggleAccessoryProps {
    parentElement: HTMLElement;
    defaultValue: boolean;
    onChange: (value: boolean) => void;
}
export declare class ToggleAccessory extends Actor<ToggleAccessoryProps> {
    private _isToggleActive;
    constructor(props: ToggleAccessoryProps);
    forceToggleValue(): void;
    onActivate(): void;
}
