import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Timer } from "skytree";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { FloatLabelTextInput } from "../../../src/FloatLabelTextInput";

export class FloatLabelTextInputDemo extends DemoActor<void> {
  onActivate() {
    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing: false,
      })
    );

    const card = this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
      })
    );

    const value = Observable.ofEmpty<string>();

    const isInvalid = Observable.givenValue(false);

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(3),
        isRepeating: true,
        fn: () => {
          isInvalid.setValue(!isInvalid.value);
        }
      })
    );
    
    this.addActor(
      new FloatLabelTextInput({
        parentElement: card.baseElement,
        persistentLabel: "Set Title",
        placeholder: "Your title here",
        value,
        displayTextGivenValue: (v) => v,
        valueGivenDisplayText: (v) => v,
        isInvalid
      })
    );
  }
}
