import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom, Card, ToggleButton } from "../../../src";

export class ToggleButtonDemo extends DemoActor<void> {
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
      new ToggleButton({
        target: {
          type: "parentElement",
          parentElement: card.element
        },
        isActive: Observable.givenValue<boolean>(true)
      })
    );
  }
}
