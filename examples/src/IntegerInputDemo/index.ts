import { Actor } from "skytree";
import { ValuePath } from "@anderjason/util";
import { Card } from "../../../src/Card";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Koji } from "../../../src/Koji";
import { IntegerInput } from "../../../src/IntegerInput";

export interface IntegerInputDemoProps {}

export class IntegerInputDemo
  extends Actor<IntegerInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const vccPath = ValuePath.givenString("quantity");
    Koji.instance.vccData.update(vccPath, 0);

    const card = this.addActor(
      new Card({
        element: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
      })
    );

    this.addActor(
      new IntegerInput({
        parentElement: card.element,
        placeholder: "Set quantity",
        persistentLabel: "Quantity",
        vccPath,
      })
    );
  }
}
