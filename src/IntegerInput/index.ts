import { Actor } from "skytree";
import { FloatLabelTextInput } from "../FloatLabelTextInput";
import { Observable } from "@anderjason/observable";

export interface IntegerInputProps {
  parentElement: HTMLElement;
  value: Observable<number>;
  persistentLabel: string;
  placeholder: string;
}

export class IntegerInput extends Actor<IntegerInputProps> {
  onActivate() {
    this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        placeholder: this.props.placeholder,
        value: this.props.value,
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
