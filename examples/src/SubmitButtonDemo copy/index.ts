import { DemoActor } from "@anderjason/example-tools";
import { Observable, ObservableSet } from "@anderjason/observable";
import { Actor, Timer } from "skytree";
import { Card } from "../../../src/Card";
import { KojiAppearance } from "../../../src/KojiAppearance";
import { SubmitButton, SubmitButtonMode } from "../../../src/SubmitButton";
import { Duration } from "@anderjason/time";
import { ElementStyle } from "@anderjason/web";
import { AlignBottom } from "../../../src";

export interface SubmitButtonDemoProps {}

export class SubmitButtonDemo
  extends Actor<SubmitButtonDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const isRemixing = Observable.givenValue(false);

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(2),
        isRepeating: true,
        fn: () => {
          isRemixing.setValue(!isRemixing.value);
        },
      })
    );

    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing,
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
