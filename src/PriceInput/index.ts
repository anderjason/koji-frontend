import { Observable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import { Actor } from "skytree";
import { FloatLabelTextInput } from "../FloatLabelTextInput";

export interface PriceInputProps {
  parentElement: HTMLElement;
  usdCents: Observable<number>;
  persistentLabel: string;
}

export class PriceInput extends Actor<PriceInputProps> {
  onActivate() {
    this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        value: this.props.usdCents,
        displayTextGivenValue: (price) => {
          if (price == null || isNaN(price)) {
            return "";
          }

          return "$" + price.toString();
        },
        shadowTextGivenValue: (price) => {
          if (price == null || isNaN(price)) {
            return "$0.00";
          }

          return "$" + price.toFixed(2);
        },
        applyShadowTextOnBlur: true,
        valueGivenDisplayText: (displayText) => {
          if (
            StringUtil.stringIsEmpty(displayText) ||
            displayText === "$" ||
            displayText === "." ||
            displayText === "$."
          ) {
            return 0;
          }

          try {
            let text = displayText.replace("$", "");
            if (StringUtil.stringIsEmpty(text)) {
              return 0;
            }

            return parseFloat(text);
          } catch {
            return 0;
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
