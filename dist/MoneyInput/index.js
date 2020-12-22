"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyInput = exports.shouldRejectInput = void 0;
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
function shouldRejectInput(input) {
    if (util_1.StringUtil.stringIsEmpty(input)) {
        return false;
    }
    const inputWithoutMoneySymbols = input.replace(".", "").replace("$", "");
    // reject if the input contains non-digit characters, excluding money symbols
    if (/\D/.test(inputWithoutMoneySymbols)) {
        return true;
    }
    return false;
}
exports.shouldRejectInput = shouldRejectInput;
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
            displayTextGivenValue: (price) => {
                if (price == null) {
                    return "";
                }
                return price.toString("$1.00");
            },
            valueGivenDisplayText: (displayText) => {
                if (util_1.StringUtil.stringIsEmpty(displayText) ||
                    displayText === "$" ||
                    displayText === "." ||
                    displayText === "$.") {
                    if (this.props.allowEmpty == true) {
                        return undefined;
                    }
                    else {
                        return new money_1.Money(0, money_1.Currency.ofUSD());
                    }
                }
                try {
                    let text = displayText.replace("$", "");
                    if (util_1.StringUtil.stringIsEmpty(text)) {
                        return new money_1.Money(0, money_1.Currency.ofUSD());
                    }
                    return new money_1.Money(Math.round(parseFloat(text) * 100), money_1.Currency.ofUSD());
                }
                catch (_a) {
                    return new money_1.Money(0, money_1.Currency.ofUSD());
                }
            },
            overrideDisplayText: (e) => {
                if (shouldRejectInput(e.displayText)) {
                    return e.previousDisplayText;
                }
                if (e.displayText == "") {
                    if (this.props.allowEmpty == true) {
                        return "";
                    }
                    ;
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
        }));
        this.cancelOnDeactivate(this._textInput.isFocused.didChange.subscribe(isFocused => {
            if (isFocused == false) {
                if (this.props.allowEmpty == true && util_1.StringUtil.stringIsEmpty(this._textInput.displayText)) {
                    this.props.value.setValue(undefined);
                }
                else {
                    this.props.value.didChange.emit(this.props.value.value);
                }
            }
        }));
    }
}
exports.MoneyInput = MoneyInput;
//# sourceMappingURL=index.js.map