import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom, KojiAppearance, SubmitButton } from "../../../src";
import { Card } from "../../../src/Card";
import { DisplayText } from "../../../src/DisplayText";

export class DisplayTextDemo extends DemoActor<void> {
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
      new DisplayText({
        parentElement: card.baseElement,
        displayType: "title",
        text: Observable.givenValue("First line\nSecond line"),
      })
    );

    this.addActor(
      new DisplayText({
        parentElement: card.baseElement,
        displayType: "description",
        text: `Lorem ipsum\ndolor set amet`,
      })
    );

    this.addActor(
      new SubmitButton({
        target: {
          type: "parentElement",
          parentElement: card.baseElement,
        },
        text: "Buy the thing",
        onClick: () => {},
        buttonMode: "ready",
      })
    );
  }
}
