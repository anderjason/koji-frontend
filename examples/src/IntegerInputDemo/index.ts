import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { IntegerInput } from "../../../src/IntegerInput";

export interface IntegerInputDemoProps {}

export class IntegerInputDemo extends DemoActor<IntegerInputDemoProps> {
  onActivate() {
    const value = Observable.givenValue(0, Observable.isStrictEqual);

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
      new IntegerInput({
        parentElement: card.baseElement,
        placeholder: "Set quantity",
        persistentLabel: "Quantity",
        value,
      })
    );
  }
}
