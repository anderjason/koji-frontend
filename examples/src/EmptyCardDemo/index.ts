import { DemoActor } from "@anderjason/example-tools";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";

export class EmptyCardDemo extends DemoActor<void> {
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

    this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
      })
    );
  }
}
