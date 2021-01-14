"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsList = void 0;
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const __1 = require("..");
const LineItem_1 = require("./_internal/LineItem");
class OptionsList extends skytree_1.Actor {
    constructor(props) {
        super(props);
        __1.KojiAppearance.preloadFonts();
        this._definitions = observable_1.Observable.givenValueOrObservable(this.props.definitions);
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        wrapper.element.classList.add("kft-control");
        const valuesByPropertyName = observable_1.ObservableDict.givenValues(this.props.defaultValues || {});
        this.cancelOnDeactivate(valuesByPropertyName.didChangeSteps.subscribe((steps) => {
            steps.forEach((step) => {
                this.props.onChange(step.key, step.newValue);
            });
        }));
        this.addActor(new skytree_1.ExclusiveActivator({
            input: this._definitions,
            fn: (definitions) => {
                return new skytree_1.ArrayActivator({
                    input: definitions,
                    fn: (optionDefinition) => {
                        return new LineItem_1.LineItem({
                            parentElement: wrapper.element,
                            optionDefinition,
                            valuesByPropertyName,
                        });
                    },
                });
            }
        }));
    }
}
exports.OptionsList = OptionsList;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    margin: -10px -20px -10px 0;
  `,
});
//# sourceMappingURL=index.js.map