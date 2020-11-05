import { Actor } from "skytree";
import { ValuePath } from "@anderjason/util";
import { Card } from "../../../src/Card";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Koji } from "../../../src/Koji";
import { IntegerInput } from "../../../src/IntegerInput";
import { ElementStyle } from "@anderjason/web";

export interface IntegerInputDemoProps {}

export class IntegerInputDemo
  extends Actor<IntegerInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const vccPath = ValuePath.givenString("quantity");
    Koji.instance.vccData.update(vccPath, 0);

    const cardWrapper = this.addActor(
      CardWrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    const card = this.addActor(
      new Card({
        element: {
          type: "parentElement",
          parentElement: cardWrapper.element,
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

const CardWrapperStyle = ElementStyle.givenDefinition({
  css: `
    position: absolute;
    left: 20px;
    bottom: 20px;
    right: 20px;
  `,
});
