import { Actor } from "skytree";
import { ValuePath } from "@anderjason/util";
import { Card } from "../../../src/Card";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Koji } from "../../../src/Koji";
import { PriceInput } from "../../../src/PriceInput";

export interface PriceInputDemoProps {}

export class PriceInputDemo
  extends Actor<PriceInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const vccPath = ValuePath.givenString("price");
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
      new PriceInput({
        parentElement: card.element,
        persistentLabel: "Set Price",
        vccPath,
      })
    );
  }
}
