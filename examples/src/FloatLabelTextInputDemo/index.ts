import { DemoActor } from "@anderjason/example-tools";
import { FloatLabelTextInput } from "../../../src/FloatLabelTextInput";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Card } from "../../../src/Card";

export interface FloatLabelTextInputDemoProps {}

export class FloatLabelTextInputDemo
  extends Actor<FloatLabelTextInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const card = this.addActor(
      new Card({
        element: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
      })
    );

    const value = Observable.ofEmpty<string>();

    this.addActor(
      new FloatLabelTextInput({
        parentElement: card.element,
        persistentLabel: "Set Title",
        placeholder: "Your title here",
        value,
        displayTextGivenValue: (v) => v,
        valueGivenDisplayText: (v) => v,
      })
    );
  }
}
