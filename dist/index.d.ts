/// <reference path="../src/index.d.ts" />
import { AlignBottom } from "./AlignBottom";
import { Callout } from "./Callout";
import { Card } from "./Card";
import { ConfirmationPrompt } from "./ConfirmationPrompt";
import { DisplayText } from "./DisplayText";
import { EditableText } from "./EditableText";
import { FloatLabelTextarea } from "./FloatLabelTextarea";
import { FloatLabelTextInput } from "./FloatLabelTextInput";
import { IntegerInput } from "./IntegerInput";
import { KojiAppearance } from "./KojiAppearance";
import { KojiNetworkUtil } from "./KojiNetworkUtil";
import { KojiTools } from "./KojiTools";
import { LoadingIndicator } from "./LoadingIndicator";
import { MoneyInput } from "./MoneyInput";
import { Observable } from "@anderjason/observable";
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
export { AlignBottom, Callout, Card, ConfirmationPrompt, DisplayText, EditableText, FloatLabelTextarea, FloatLabelTextInput, IntegerInput, KojiTools, KojiAppearance, KojiNetworkUtil, LoadingIndicator, MoneyInput, RemixModeButton, RemixTarget, SubmitButton, ThemeToolbar, };
