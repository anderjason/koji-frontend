import { DemoActor } from "@anderjason/example-tools";
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

    this.addActor(
      new EditableText({
        parentElement: card.baseElement,
        displayType: "title",
        placeholderLabel: "Type a title here",
      })
    );

    this.addActor(
      new EditableText({
        parentElement: card.baseElement,
        displayType: "description",
        placeholderLabel: "Type a description here",
      })
    );
  }
}
