import { ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { Actor } from "skytree";
import { CardLayout } from "./CardLayout";
export interface CurrentLayoutHeightProps {
    layout: ObservableBase<CardLayout>;
}
export declare class CurrentLayoutHeight extends Actor<CurrentLayoutHeightProps> {
    private _output;
    readonly output: ReadOnlyObservable<number>;
    onActivate(): void;
}
