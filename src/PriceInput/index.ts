import { StringUtil, ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
import { Vcc } from "..";
import { FloatLabelTextInput } from "../FloatLabelTextInput";

export interface PriceInputProps {
  parentElement: HTMLElement;
  vccPath: ValuePath;
  persistentLabel: string;
}

export class PriceInput extends Actor<PriceInputProps> {
  onActivate() {
    const priceVccPathBinding = this.addActor(
      Vcc.instance.observableState.toBindingGivenPath<number>(
        this.props.vccPath
      )
    );

    this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        value: priceVccPathBinding.output,
        displayTextGivenValue: (price) => {
          if (price == null || isNaN(price)) {
            return "";
          }

          return "$" + price.toString();
        },
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
