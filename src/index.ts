/// <reference path="./index.d.ts" />

import { AlignBottom } from "./AlignBottom";
import { Callout } from "./Callout";
import { Card } from "./Card";
import { ConfirmationPrompt } from "./ConfirmationPrompt";
import { FloatLabelTextInput } from "./FloatLabelTextInput";
import { IntegerInput } from "./IntegerInput";
import { KojiTools } from "./KojiTools";
import { KojiAppearance } from "./KojiAppearance";
import { KojiNetworkUtil } from "./KojiNetworkUtil";
import { LoadingIndicator } from "./LoadingIndicator";
import { MoneyInput } from "./MoneyInput";
import { Observable } from "@anderjason/observable";
import { RemixModeButton } from "./RemixModeButton";
import { RemixTarget } from "./RemixTarget";
import { SubmitButton } from "./SubmitButton";
import { ThemeToolbar } from "./ThemeToolbar";
import { DisplayText } from "./DisplayText";
import { EditableText } from "./EditableText";

export interface ParentElement {
  type: "parentElement";
  parentElement: HTMLElement | Observable<HTMLElement>;
}

export interface ThisElement<T> {
  type: "thisElement";
  element: T;
}

export type ThisOrParentElement<T> = ParentElement | ThisElement<T>;

export {
  AlignBottom,
  Callout,
  Card,
  ConfirmationPrompt,
  DisplayText,
  EditableText,
  FloatLabelTextInput,
  IntegerInput,
  KojiTools,
  KojiAppearance,
  KojiNetworkUtil,
  LoadingIndicator,
  MoneyInput,
  RemixModeButton,
  RemixTarget,
  SubmitButton,
  ThemeToolbar,
};
