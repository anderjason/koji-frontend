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

    const value = Observable.ofEmpty<string>();

    this.addActor(
      new FloatLabelTextarea({
        parentElement: card.baseElement,
        persistentLabel: "Set Title",
        placeholder: "Your title here",
        value,
        isInvalid,
        displayTextGivenValue: (v) => v,
        valueGivenDisplayText: (v) => v,
      })
    );
  }
}
