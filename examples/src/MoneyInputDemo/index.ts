import { DemoActor } from "@anderjason/example-tools";
import { Currency, Money } from "@anderjason/money";
import { Observable } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { MoneyInput } from "../../../src/MoneyInput";

export interface MoneyInputDemoProps {}

export class MoneyInputDemo
  extends Actor<MoneyInputDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const value = Observable.givenValue<Money>(
      new Money(0, Currency.ofUSD()),
      Money.isEqual
    );

    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing: false,
      })
    );

    const currentValue = this.addActor(
      CurrentValueStyle.toManagedElement({
        tagName: "div",
        parentElement: alignBottom.element,
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

    this.cancelOnDeactivate(
      value.didChange.subscribe((v) => {
        if (v == null) {
          currentValue.element.innerHTML = "No price set";
        } else {
          currentValue.element.innerHTML = v.toString("$1.00");
        }
      }, true)
    );

    this.addActor(
      new MoneyInput({
        parentElement: card.element,
        persistentLabel: "Set Price",
        value,
      })
    );
  }
}

const CurrentValueStyle = ElementStyle.givenDefinition({
  css: `
    color: #007AFF;
    font-family: monospace;
    margin: 0 50px;
    font-size: 16px;
  `,
});
