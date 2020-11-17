import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { KojiAppearance } from "../../../src/KojiAppearance";
import { SubmitButton, SubmitButtonMode } from "../../../src/SubmitButton";

export interface SubmitButtonDemoProps {}

export class SubmitButtonDemo extends DemoActor<SubmitButtonDemoProps> {
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

    this.addActor(
      new SubmitButton({
        target: {
          type: "parentElement",
          parentElement: card.element,
        },
        text: "Unlock now",
        theme: KojiAppearance.themes.get("kojiBlack"),
        buttonMode,
        onClick: async () => {
          buttonMode.setValue("busy");

          await Duration.givenSeconds(1.5).toDelay();
          buttonMode.setValue("success");

          await Duration.givenSeconds(2).toDelay();
          buttonMode.setValue("ready");
        },
      })
    );
  }
}
