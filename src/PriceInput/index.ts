import { Observable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import { Actor } from "skytree";
import { FloatLabelTextInput } from "../FloatLabelTextInput";
import { Currency, Money } from "@anderjason/money";

export interface PriceInputProps {
  parentElement: HTMLElement;
  value: Observable<Money>;
  persistentLabel: string;
}

export class PriceInput extends Actor<PriceInputProps> {
  onActivate() {
    this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        value: this.props.value,
        displayTextGivenValue: (price) => {
          if (price == null) {
            return "";
          }

          return "$" + price.rawValue.toString();
        },
        shadowTextGivenValue: (price) => {
          if (price == null || price.isZero) {
            return "$0.00";
          }

          return price.toString("$1.00");
        },
        applyShadowTextOnBlur: true,
        valueGivenDisplayText: (displayText) => {
          if (
            StringUtil.stringIsEmpty(displayText) ||
            displayText === "$" ||
            displayText === "." ||
            displayText === "$."
          ) {
            return new Money(0, Currency.ofUSD());
          }

          try {
            let text = displayText.replace("$", "");
            if (StringUtil.stringIsEmpty(text)) {
              return new Money(0, Currency.ofUSD());
            }

            console.log(text);
            return new Money(
              Math.round(parseFloat(text) * 100),
              Currency.ofUSD()
            );
          } catch {
            return new Money(0, Currency.ofUSD());
          }
        },
        overrideDisplayText: (e) => {
          if (e.displayText == "") {
            return "$";
          }

          if (e.displayText === "$." || e.displayText === ".") {
            return "$0.";
          }

          if (e.displayText === "$00") {
            return "$0";
          }

          if (e.displayText === "00") {
            return "0";
          }

          let text = e.displayText;
          if (!text.startsWith("$")) {
            text = "$" + text;
          }

          // only allow things that look like a price
          if (text.match(/^\$[0-9]*\.?[0-9]{0,2}$/gm) == null) {
            return e.previousDisplayText;
          }

          return text.replace(/^\$0+([1-9]+)/, "$$$1");
        },
      })
    );
  }
}
