import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { KojiAppearance } from "../../../src/KojiAppearance";
import { SubmitButton, SubmitButtonMode } from "../../../src/SubmitButton";

export class SubmitButtonDemo extends DemoActor<void> {
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

    const buttonMode = Observable.givenValue<SubmitButtonMode>("ready");
    const buttonText = Observable.givenValue<string>("Unlock now");

    this.addActor(
      new SubmitButton({
        target: {
          type: "parentElement",
          parentElement: card.baseElement,
        },
        text: buttonText,
        buttonMode,
        onClick: async () => {
          buttonMode.setValue("busy");

          await Duration.givenSeconds(1.5).toDelay();
          buttonMode.setValue("success");

          await Duration.givenSeconds(2.5).toDelay();
          buttonMode.setValue("disabled");
          buttonText.setValue("Sold out")

          await Duration.givenSeconds(4).toDelay();
          buttonMode.setValue("ready");
          buttonText.setValue("Unlock now")
        },
      })
    );
  }
}
