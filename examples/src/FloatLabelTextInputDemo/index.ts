import { DemoActor } from "@anderjason/example-tools";
import { FloatLabelTextInput } from "../../../src/FloatLabelTextInput";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Card } from "../../../src/Card";
import { ElementStyle } from "@anderjason/web";
import { AlignBottom } from "../../../src";

export interface FloatLabelTextInputDemoProps {}

export class FloatLabelTextInputDemo
  extends Actor<FloatLabelTextInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const alignBottom = this.addActor(
      new AlignBottom({
        element: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing: false,
      })
    );

    const card = this.addActor(
      new Card({
        element: {
          type: "parentElement",
          parentElement: alignBottom.element,
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
