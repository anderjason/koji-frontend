import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { StringUtil } from "@anderjason/util";
import { Actor } from "skytree";
import { FloatLabelTextInput } from "../FloatLabelTextInput";
import { Currency, Money } from "@anderjason/money";

export interface MoneyInputProps {
  parentElement: HTMLElement;
  value: Observable<Money>;
  
  allowEmpty?: boolean;
  errorLabel?: string | ObservableBase<string>;
  maxValue?: Money;
  persistentLabel?: string | ObservableBase<string>;
  placeholderLabel?: string | ObservableBase<string>;
  supportLabel?: string | ObservableBase<string>;
}

export function shouldRejectInput(input: string): boolean {
  if (StringUtil.stringIsEmpty(input)) {
    return false;
  }

  const inputWithoutMoneySymbols = input.replace(".", "").replace("$", "");

  // reject if the input contains non-digit characters, excluding money symbols
  if (/\D/.test(inputWithoutMoneySymbols)) {
    return true;
  }

  return false;
}

export class MoneyInput extends Actor<MoneyInputProps> {
  private _textInput: FloatLabelTextInput<Money>;

  get isFocused(): ReadOnlyObservable<boolean> {
    return this._textInput.isFocused;
  }
  
  onActivate() {
    this._textInput = this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        placeholderLabel: this.props.placeholderLabel,
        supportLabel: this.props.supportLabel,
        errorLabel: this.props.errorLabel,
        value: this.props.value,
        inputMode: "decimal",
        displayTextGivenValue: (price) => {
          if (price == null) {
            return "";
          }

          return price.toString("$1.00");
        },
        valueGivenDisplayText: (displayText) => {
          if (
            StringUtil.stringIsEmpty(displayText) ||
            displayText === "$" ||
            displayText === "." ||
            displayText === "$."
          ) {
            if (this.props.allowEmpty == true) {
              return undefined; 
            } else {
              return new Money(0, Currency.ofUSD());
            }
          }

          try {
            let text = displayText.replace("$", "");
            if (StringUtil.stringIsEmpty(text)) {
              return new Money(0, Currency.ofUSD());
            }

            return new Money(
              Math.round(parseFloat(text) * 100),
              Currency.ofUSD()
            );
          } catch {
            return new Money(0, Currency.ofUSD());
          }
        },
        overrideDisplayText: (e) => {
          if (shouldRejectInput(e.displayText)) {
            return e.previousDisplayText;
          }

          if (e.displayText == "") {
            if (this.props.allowEmpty == true) {
              return ""
            };

            return {
              text: "$",
              caretPosition: 1
            };
          }

          if (e.displayText === "$." || e.displayText === ".") {
            return {
              text: "$0.",
              caretPosition: 3
            };
          }

          if (e.displayText === "$00") {
            return {
              text: "$0",
              caretPosition: 2
            };
          }

          if (e.displayText === "00") {
            return {
              text: "0",
              caretPosition: 1
            };
          }

          let text = e.displayText;
          let caretPosition = e.caretPosition;

          if (!text.startsWith("$")) {
            text = "$" + text;
            caretPosition += 1;
          }

          // only allow things that look like a price
          if (text.match(/^\$[0-9]*\.?[0-9]{0,2}$/gm) == null) {
            return e.previousDisplayText;
          }
          
          if (e.value != null && this.props.maxValue != null) {
            if (e.value.rawValue > this.props.maxValue.rawValue) {
              return e.previousDisplayText;
            }
          }

          const newPriceString = text.replace(/^\$0+([1-9]+)/, "$$$1");

          return {
            text: newPriceString,
            caretPosition,
          };
        },
      })
    );

    this.cancelOnDeactivate(
      this._textInput.isFocused.didChange.subscribe(isFocused => {
        if (isFocused == false) {
          if (this.props.allowEmpty == true && StringUtil.stringIsEmpty(this._textInput.displayText)) {
            this.props.value.setValue(undefined);
          } else {
            this.props.value.didChange.emit(this.props.value.value);
          }
        }
      })
    );
  }
}
