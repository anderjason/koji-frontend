"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsSummary = void 0;
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const __1 = require("..");
const LineItem_1 = require("./_internal/LineItem");
class OptionsSummary extends skytree_1.Actor {
    constructor(props) {
        super(props);
        __1.KojiAppearance.preloadFonts();
    }
    onActivate() {
        const wrapper = this.addActor(web_1.ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        wrapper.element.classList.add("kft-control");
        this.addActor(new skytree_1.ArrayActivator({
            input: this.props.items,
            fn: (item) => {
                console.log(item);
                return new LineItem_1.LineItem({
                    parentElement: wrapper.element,
                    label: item.label,
                    accessoryData: item.accessoryData,
                });
            },
        }));
    }
}
exports.OptionsSummary = OptionsSummary;
//# sourceMappingURL=index.js.map