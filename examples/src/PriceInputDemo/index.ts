import { Actor } from "skytree";
import { ValuePath } from "@anderjason/util";
import { Card } from "../../../src/Card";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Koji } from "../../../src/Koji";
import { PriceInput } from "../../../src/PriceInput";
import { ElementStyle } from "@anderjason/web";

export interface PriceInputDemoProps {}

export class PriceInputDemo
  extends Actor<PriceInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const vccPath = ValuePath.givenString("price");
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
      new PriceInput({
        parentElement: card.element,
        persistentLabel: "Set Price",
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
