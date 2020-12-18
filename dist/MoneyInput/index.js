"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyInput = void 0;
const util_1 = require("@anderjason/util");
const skytree_1 = require("skytree");
const FloatLabelTextInput_1 = require("../FloatLabelTextInput");
const money_1 = require("@anderjason/money");
class MoneyInput extends skytree_1.Actor {
    get isFocused() {
        return this._textInput.isFocused;
    }
    onActivate() {
        this._textInput = this.addActor(new FloatLabelTextInput_1.FloatLabelTextInput({
            parentElement: this.props.parentElement,
            persistentLabel: this.props.persistentLabel,
            value: this.props.value,
            isInvalid: this.props.isInvalid,
            inputMode: "decimal",
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
                if (util_1.StringUtil.stringIsEmpty(displayText) ||
                    displayText === "$" ||
                    displayText === "." ||
                    displayText === "$.") {
                    return new money_1.Money(0, money_1.Currency.ofUSD());
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
                if (this.props.maxValue != null) {
                    if (e.value.rawValue > this.props.maxValue.rawValue) {
                        return e.previousDisplayText;
                    }
                }
                return text.replace(/^\$0+([1-9]+)/, "$$$1");
            },
        }));
    }
}
exports.MoneyInput = MoneyInput;
//# sourceMappingURL=index.js.map