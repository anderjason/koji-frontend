import { DemoActor } from "@anderjason/example-tools";
import { AlignBottom, EditableText } from "../../../src";
import { Card } from "../../../src/Card";

export interface EditableTextDemoProps {}

export class EditableTextDemo extends DemoActor<EditableTextDemoProps> {
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

    this.addActor(
      new EditableText({
        parentElement: card.element,
        displayType: "title",
        placeholderLabel: "Type a title here",
      })
    );

    this.addActor(
      new EditableText({
        parentElement: card.element,
        displayType: "description",
        placeholderLabel: "Type a description here",
      })
    );
  }
}
