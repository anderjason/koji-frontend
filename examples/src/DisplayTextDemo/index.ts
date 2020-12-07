import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom, KojiAppearance, SubmitButton } from "../../../src";
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
        parentElement: card.baseElement,
        displayType: "title",
        text: Observable.givenValue("Something is for sale"),
        theme: Observable.givenValue(KojiAppearance.themes.get("kojiBlack")),
      })
    );

    this.addActor(
      new DisplayText({
        parentElement: card.baseElement,
        displayType: "description",
        text: Observable.givenValue("This is a description of the thing"),
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
        theme: KojiAppearance.themes.get("kojiBlack"),
      })
    );
  }
}
