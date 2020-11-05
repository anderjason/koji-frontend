import { DemoActor } from "@anderjason/example-tools";
import { FloatLabelTextInput } from "../../../src/FloatLabelTextInput";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Card } from "../../../src/Card";
import { ElementStyle } from "@anderjason/web";

export interface FloatLabelTextInputDemoProps {}

export class FloatLabelTextInputDemo
  extends Actor<FloatLabelTextInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const cardWrapper = this.addActor(
      CardWrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    const card = this.addActor(
      new Card({
        element: {
          type: "parentElement",
          parentElement: cardWrapper.element,
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

const CardWrapperStyle = ElementStyle.givenDefinition({
  css: `
    position: absolute;
    left: 20px;
    bottom: 20px;
    right: 20px;
  `,
});
