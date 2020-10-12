"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceInput = void 0;
const util_1 = require("@anderjason/util");
const skytree_1 = require("skytree");
const Koji_1 = require("../Koji");
const FloatLabelTextInput_1 = require("../FloatLabelTextInput");
class PriceInput extends skytree_1.Actor {
    onActivate() {
        const priceVccPathBinding = this.addActor(Koji_1.Koji.instance.vccData.toBinding({
            valuePath: this.props.vccPath,
        }));
        this.addActor(new FloatLabelTextInput_1.FloatLabelTextInput({
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
                if (util_1.StringUtil.stringIsEmpty(displayText) ||
                    displayText === "$" ||
                    displayText === "." ||
                    displayText === "$.") {
                    return 0;
                }
                try {
                    let text = displayText.replace("$", "");
                    if (util_1.StringUtil.stringIsEmpty(text)) {
                        return 0;
                    }
                    return parseFloat(text);
                }
                catch (_a) {
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
        }));
    }
}
exports.PriceInput = PriceInput;
//# sourceMappingURL=index.js.map