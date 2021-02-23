import { AlignBottom } from "./AlignBottom";
import { Callout } from "./Callout";
import { Card } from "./Card";
import { DisplayText } from "./DisplayText";
import { FloatLabelTextarea } from "./FloatLabelTextarea";
import { FloatLabelTextInput } from "./FloatLabelTextInput";
import { IntegerInput } from "./IntegerInput";
import { KojiAppearance } from "./KojiAppearance";
import { KojiNetworkUtil } from "./KojiNetworkUtil";
import { LoadingIndicator } from "./LoadingIndicator";
import { MoneyInput } from "./MoneyInput";
import { Observable } from "@anderjason/observable";
import { OptionsList } from "./OptionsList";
import { PublishButton } from "./PublishButton";
import { SubmitButton } from "./SubmitButton";
import { ToggleButton } from "./ToggleButton";

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
  DisplayText,
  FloatLabelTextarea,
  FloatLabelTextInput,
  IntegerInput,
  KojiAppearance,
  KojiNetworkUtil,
  LoadingIndicator,
  MoneyInput,
  OptionsList,
  PublishButton,
  SubmitButton,
  ToggleButton
};
