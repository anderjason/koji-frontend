"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyInput = void 0;
const util_1 = require("@anderjason/util");
const skytree_1 = require("skytree");
const FloatLabelTextInput_1 = require("../FloatLabelTextInput");
const money_1 = require("@anderjason/money");
function rawNumberGivenText(input) {
    if (util_1.StringUtil.stringIsEmpty(input)) {
        return 0;
    }
    let text = input.replace("$", "");
    // remove leading zeros and decimal point
    text = text.replace(/^[0.]*/, "");
    // remove anything that's not a number
    text = text.replace(/\D/, "");
    if (util_1.StringUtil.stringIsEmpty(text)) {
        return 0;
    }
    const result = Math.round(parseFloat(text));
    return isNaN(result) ? 0 : result;
}
class MoneyInput extends skytree_1.Actor {
    get isFocused() {
        return this._textInput.isFocused;
    }
    onActivate() {
        this._textInput = this.addActor(new FloatLabelTextInput_1.FloatLabelTextInput({
            parentElement: this.props.parentElement,
            persistentLabel: this.props.persistentLabel,
            placeholder: this.props.placeholderLabel,
            value: this.props.value,
            isInvalid: this.props.isInvalid,
            inputMode: "decimal",
            displayTextGivenValue: (v) => {
                if (v == null) {
                    return "";
                }
                return v.toString("$1.00");
            },
            valueGivenDisplayText: (displayText) => {
                if (util_1.StringUtil.stringIsEmpty(displayText)) {
                    if (this.props.allowEmpty == true) {
                        return undefined;
                    }
                    else {
                        return new money_1.Money(0, money_1.Currency.ofUSD());
                    }
                }
                try {
                    const rawNumber = rawNumberGivenText(displayText);
                    return new money_1.Money(rawNumber, money_1.Currency.ofUSD());
                }
                catch (_a) {
                    return new money_1.Money(0, money_1.Currency.ofUSD());
                }
            },
            overrideDisplayText: (e) => {
                const rawNumber = rawNumberGivenText(e.displayText);
                if ((e.previousValue == null || e.previousValue.isZero) &&
                    rawNumber == 0) {
                    if (this.props.allowEmpty == true) {
                        return {
                            text: "",
                            caretPosition: null,
                        };
                    }
                    else {
                        return {
                            text: "$0.00",
                            caretPosition: null,
                        };
                    }
                }
                if (e.value == null) {
                    if (this.props.allowEmpty == true) {
                        return {
                            text: "",
                            caretPosition: null,
                        };
                    }
                    else {
                        return {
                            text: "$0.00",
                            caretPosition: null,
                        };
                    }
                }
                else {
                    const newPriceString = e.value.toString("$1.00");
                    let caretPosition = e.caretPosition;
                    if (caretPosition == 0) {
                        caretPosition = null;
                    }
                    else {
                        const oldPriceString = e.previousDisplayText;
                        if (newPriceString.length > oldPriceString.length) {
                            caretPosition += 1;
                        }
                        else if (newPriceString.length < oldPriceString.length) {
                            caretPosition -= 1;
                        }
                    }
                    return {
                        text: newPriceString,
                        caretPosition,
                    };
                }
            },
        }));
    }
}
exports.MoneyInput = MoneyInput;
//# sourceMappingURL=index.js.map