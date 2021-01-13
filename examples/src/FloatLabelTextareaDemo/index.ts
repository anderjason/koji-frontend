import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Timer } from "skytree";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { FloatLabelTextarea } from "../../../src/FloatLabelTextarea";

export class FloatLabelTextareaDemo extends DemoActor<void> {
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
        maxHeight: 300
      })
    );

    const errorLabel = Observable.ofEmpty<string>();

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(3),
        isRepeating: true,
        fn: () => {
          errorLabel.setValue(errorLabel.value == null ? "Please correct errors before continuing" : null);
        }
      })
    );

    const value = Observable.ofEmpty<string>();

    this.addActor(
      new FloatLabelTextarea({
        parentElement: card.element,
        persistentLabel: "Set Title",
        placeholderLabel: "Your title here",
        supportLabel: "Something about this field",
        value,
        errorLabel,
        minRows: 3,
        maxRows: 5,
        displayTextGivenValue: (v) => v,
        valueGivenDisplayText: (v) => v,
      })
    );
  }
}
