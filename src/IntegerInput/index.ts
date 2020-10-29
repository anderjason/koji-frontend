import { ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
import { Koji } from "../Koji";
import { FloatLabelTextInput } from "../FloatLabelTextInput";

export interface IntegerInputProps {
  parentElement: HTMLElement;
  vccPath: ValuePath;
  persistentLabel: string;
  placeholder: string;
}

export class IntegerInput extends Actor<IntegerInputProps> {
  onActivate() {
    const vccBinding = this.addActor(
      Koji.instance.vccData.toBinding<number>({
        valuePath: this.props.vccPath,
      })
    );

    this.addActor(
      new FloatLabelTextInput({
        parentElement: this.props.parentElement,
        persistentLabel: this.props.persistentLabel,
        placeholder: this.props.placeholder,
        value: vccBinding.output,
        inputType: "number",
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
