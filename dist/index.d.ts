import { Callout } from "./Callout";
import { Card } from "./Card";
import { Description } from "./Description";
import { FloatLabelTextInput } from "./FloatLabelTextInput";
import { Koji } from "./Koji";
import { KojiAppearance } from "./KojiAppearance";
import { KojiNetworkUtil } from "./KojiNetworkUtil";
import { LoadingIndicator } from "./LoadingIndicator";
import { Observable } from "@anderjason/observable";
import { PriceInput } from "./PriceInput";
import { RemixModeButton } from "./RemixModeButton";
import { RemixTarget } from "./RemixTarget";
import { SubmitButton } from "./SubmitButton";
import { ThemeToolbar } from "./ThemeToolbar";
export interface ParentElement {
    type: "parentElement";
    parentElement: HTMLElement | Observable<HTMLElement>;
}
export interface ThisElement<T> {
    type: "thisElement";
    element: T;
}
export declare type ThisOrParentElement<T> = ParentElement | ThisElement<T>;
export { Callout, Card, Description, FloatLabelTextInput, Koji, KojiAppearance, KojiNetworkUtil, LoadingIndicator, PriceInput, RemixModeButton, RemixTarget, SubmitButton, ThemeToolbar, };
