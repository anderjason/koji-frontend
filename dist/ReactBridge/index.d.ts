import * as React from "react";
import { Actor } from "skytree";
export interface ReactBridgeProps {
    parentElement: HTMLElement;
    component: React.ComponentClass;
    props?: {
        [key: string]: any;
    };
}
export declare class ReactBridge extends Actor<ReactBridgeProps> {
    onActivate(): void;
    render(): void;
}
