import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Timer } from "skytree";
import { AlignBottom, EditableText } from "../../../src";
import { Card } from "../../../src/Card";

export class EditableTextDemo extends DemoActor<void> {
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
        duration: Duration.givenSeconds(5),
        isRepeating: true,
        fn: () => {
          isInvalid.setValue(!isInvalid.value);
        }
      })
    );

    this.addActor(
      new EditableText({
        parentElement: card.element,
        displayType: "title",
        placeholderLabel: "Type a title here",
        isInvalid
      })
    );

    this.addActor(
      new EditableText({
        parentElement: card.element,
        displayType: "description",
        placeholderLabel: "Type a description here",
        isInvalid
      })
    );
  }
}
