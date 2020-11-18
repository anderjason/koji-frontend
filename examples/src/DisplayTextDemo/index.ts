import { Color } from "@anderjason/color";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom, Description } from "../../../src";
import { Card } from "../../../src/Card";
import { DisplayText } from "../../../src/DisplayText";

export interface DisplayTextDemoProps {}

export class DisplayTextDemo extends DemoActor<DisplayTextDemoProps> {
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
      new DisplayText({
        parentElement: card.element,
        text: Observable.givenValue("Something is for sale"),
        color: Observable.givenValue(Color.givenHexString("#007AFF")),
        displayType: "title",
      })
    );

    this.addActor(
      new Description({
        parentElement: card.element,
        text: Observable.givenValue("This is a description of the thing"),
      })
    );
  }
}
