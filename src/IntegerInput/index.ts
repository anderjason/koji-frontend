import { Actor } from "skytree";
import { FloatLabelTextInput } from "../FloatLabelTextInput";
import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";

export interface IntegerInputProps {
  parentElement: HTMLElement;
  value: Observable<number>;
  
  persistentLabel?: string | ObservableBase<string>;
  placeholderLabel?: string | ObservableBase<string>;
  supportLabel?: string | ObservableBase<string>;
  errorLabel?: string | ObservableBase<string>;
}

export class IntegerInput extends Actor<IntegerInputProps> {
  private _textInput: FloatLabelTextInput<number>;

  get isFocused(): ReadOnlyObservable<boolean> {
    return this._textInput.isFocused;
  }
  
  onActivate() {
    this._textInput = this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        placeholderLabel: this.props.placeholderLabel,
        value: this.props.value,
        supportLabel: this.props.supportLabel,
        errorLabel: this.props.errorLabel,
        inputMode: "numeric",
        displayTextGivenValue: (value) => {
          if (value == null || isNaN(value)) {
            return "";
          }

          return value.toString();
        },
        valueGivenDisplayText: (displayText) => {
          return parseInt(displayText);
        },
        overrideDisplayText: (e) => {
          let text = e.displayText;

          // block any text that doesn't look like an integer
          if (text.match(/\D/g) != null) {
            return e.previousDisplayText;
          }

          if (text.length === 1) {
            return text;
          }

          // remove leading zeros
          return e.displayText.replace(/^0+/g, "");
        },
      })
    );
  }
}
