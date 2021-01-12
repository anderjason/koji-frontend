import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom, SubmitButton } from "../../../src";
import { Card } from "../../../src/Card";
import { DisplayText } from "../../../src/DisplayText";

const demoText = `Welcome to my meme shop!

Make your choice and I'll send you a meme. You can let me know in the description if you want a specific theme or just a random one.`;

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
        maxHeight: 300,
      })
    );

    this.addActor(
      new DisplayText({
        parentElement: card.baseElement,
        displayType: "title",
        text: Observable.givenValue("Unlock our Behind The Scenes Photos"),
      })
    );

    this.addActor(
      new DisplayText({
        parentElement: card.baseElement,
        displayType: "description",
        text: demoText,
      })
    );

    this.addActor(
      new SubmitButton({
        target: {
          type: "parentElement",
          parentElement: card.baseFooterElement,
        },
        text: "Buy the thing",
        onClick: () => {},
        buttonMode: "ready",
      })
    );
  }
}
