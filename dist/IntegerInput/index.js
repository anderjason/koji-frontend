"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerInput = void 0;
const skytree_1 = require("skytree");
const FloatLabelTextInput_1 = require("../FloatLabelTextInput");
class IntegerInput extends skytree_1.Actor {
    onActivate() {
        this.addActor(new FloatLabelTextInput_1.FloatLabelTextInput({
            parentElement: this.props.parentElement,
            persistentLabel: this.props.persistentLabel,
            placeholder: this.props.placeholder,
            value: this.props.value,
            isInvalid: this.props.isInvalid,
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
        }));
    }
}
exports.IntegerInput = IntegerInput;
//# sourceMappingURL=index.js.map