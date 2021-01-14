"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsList = void 0;
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const __1 = require("..");
const LineItem_1 = require("./_internal/LineItem");
class OptionsList extends skytree_1.Actor {
    constructor(props) {
        super(props);
        __1.KojiAppearance.preloadFonts();
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        wrapper.element.classList.add("kft-control");
        this.addActor(new skytree_1.ArrayActivator({
            input: this.props.items,
            fn: (item) => {
                return new LineItem_1.LineItem({
                    parentElement: wrapper.element,
                    label: item.label,
                    accessoryData: item.accessoryData,
                });
            },
        }));
    }
}
exports.OptionsList = OptionsList;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    margin: -10px -20px -10px 0;
  `
});
//# sourceMappingURL=index.js.map