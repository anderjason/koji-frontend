import { DemoActor } from "@anderjason/example-tools";
import { Currency, Money } from "@anderjason/money";
import { Observable } from "@anderjason/observable";
import { AlignBottom, DisplayText } from "../../../src";
import { Card } from "../../../src/Card";
import { MoneyInput } from "../../../src/MoneyInput";

export class MoneyInputDemo extends DemoActor<void> {
  onActivate() {
    const moneyPrice = Observable.givenValue<Money>(
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

    const card = this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
      })
    );

    const priceText = Observable.ofEmpty<string>();

    this.addActor(
      new DisplayText({
        parentElement: card.baseElement,
        displayType: "description",
        text: priceText,
      })
    );

    this.cancelOnDeactivate(
      moneyPrice.didChange.subscribe((price) => {
        if (price == null) {
          priceText.setValue("No price set");
        } else {
          const formattedPrice = price.toString("$1.00");
          priceText.setValue(`The price is ${formattedPrice}`);
        }
      }, true)
    );

    this.addActor(
      new MoneyInput({
        parentElement: card.baseElement,
        placeholderLabel: "Price",
        persistentLabel: "Set Price",
        maxValue: new Money(10000000, Currency.ofUSD()),
        allowEmpty: true,
        value: moneyPrice,
      })
    );
  }
}
