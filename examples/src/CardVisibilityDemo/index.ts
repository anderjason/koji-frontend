import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Timer } from "skytree";
import { AlignBottom, SubmitButton } from "../../../src";
import { Card, CardMode } from "../../../src/Card";

export class CardVisibilityDemo extends DemoActor<void> {
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

    const mode = Observable.givenValue<CardMode>("hidden");

    const card = this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
        mode
      })
    );

    card.baseElement.innerHTML = "This is the card";
    
    this.addActor(
      new SubmitButton({
        target: {
          type: "parentElement",
          parentElement: card.baseFooterElement
        },
        text: "Hide card",
        buttonMode: "ready",
        onClick: () => {
          mode.setValue("hidden");
        }
      })
    )

    this.addActor(
      new SubmitButton({
        target: {
          type: "parentElement",
          parentElement: card.hiddenElement
        },
        text: "Show card",
        buttonMode: "ready",
        onClick: () => {
          mode.setValue("visible")
        }
      })
    )
  }
}
