import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { Card } from "../../../src/Card";
import { KojiAppearance } from "../../../src/KojiAppearance";
import { SubmitButton, SubmitButtonMode } from "../../../src/SubmitButton";
import { Duration } from "@anderjason/time";

export interface SubmitButtonDemoProps {}

export class SubmitButtonDemo
  extends Actor<SubmitButtonDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const card = this.addActor(
      new Card({
        element: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
      })
    );

    const buttonMode = Observable.givenValue<SubmitButtonMode>("ready");

    this.addActor(
      new SubmitButton({
        element: {
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
