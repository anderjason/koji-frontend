"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLayout = void 0;
const skytree_1 = require("skytree");
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const __1 = require("..");
const color_1 = require("@anderjason/color");
class CardLayout extends skytree_1.Actor {
    constructor() {
        super(...arguments);
        this.listOrder = observable_1.Observable.ofEmpty();
        this._cardHeight = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.cardHeight = observable_1.ReadOnlyObservable.givenObservable(this._cardHeight);
    }
    get element() {
        return this._element;
    }
    onActivate() {
        this.props.layouts.addValue(this);
        this.listOrder.setValue(this.props.layouts.toIndexOfValue(this));
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            this.props.layouts.removeValue(this);
        }));
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        const scrollArea = this.addActor(new web_1.ScrollArea({
            parentElement: wrapper.element,
            scrollPositionColor: color_1.Color.givenHexString("#888888"),
            direction: "vertical",
        }));
        const content = this.addActor(ContentStyle.toManagedElement({
            tagName: "div",
            parentElement: scrollArea.element,
        }));
        this._element = content.element;
        const measure = this.addActor(new web_1.ElementSizeWatcher({
            element: this._element,
        }));
        const heightBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            measure.output,
            this.listOrder,
            this.props.maxHeight,
        ]));
        this.cancelOnDeactivate(heightBinding.didInvalidate.subscribe(() => {
            const size = measure.output.value;
            const listOrder = this.listOrder.value;
            const maxHeight = this.props.maxHeight.value;
            if (size == null || size.height == 0) {
                return;
            }
            let marginTop = listOrder === 0 ? 0 : __1.headerAreaHeight;
            wrapper.style.marginTop = `${marginTop}px`;
            const maxContentHeight = maxHeight - marginTop;
            const requestedContentHeight = size.height + __1.totalVerticalPadding;
            const actualContentHeight = Math.min(maxContentHeight, requestedContentHeight);
            this._cardHeight.setValue(marginTop + actualContentHeight);
            wrapper.style.height = `${actualContentHeight}px`;
            wrapper.style.transform = `translateX(${listOrder * 100}%)`;
        }, true));
    }
}
exports.CardLayout = CardLayout;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    css: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  `,
});
const ContentStyle = web_1.ElementStyle.givenDefinition({
    css: `
    background: #FFF;
    padding: 20px;
    box-sizing: border-box;
    color: #000;
  `,
});
//# sourceMappingURL=CardLayout.js.map