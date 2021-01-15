"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLayout = void 0;
const skytree_1 = require("skytree");
const observable_1 = require("@anderjason/observable");
const web_1 = require("@anderjason/web");
const __1 = require("..");
const color_1 = require("@anderjason/color");
class CardLayout extends skytree_1.Actor {
    constructor(props) {
        super(props);
        this.listOrder = observable_1.Observable.ofEmpty();
        this._cardHeight = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.cardHeight = observable_1.ReadOnlyObservable.givenObservable(this._cardHeight);
        this.title = observable_1.Observable.givenValueOrObservable(props.title);
    }
    get element() {
        return this._contentElement;
    }
    get footerElement() {
        return this._footerElement;
    }
    onActivate() {
        this.props.layouts.addValue(this);
        this.listOrder.setValue(this.props.layouts.toIndexOfValue(this));
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            this.props.layouts.removeValue(this);
        }));
        const cardLayoutWrapper = this.addActor(CardLayoutWrapper.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        const outsideScrollArea = this.addActor(OutsideScrollAreaStyle.toManagedElement({
            tagName: "div",
            parentElement: cardLayoutWrapper.element,
        }));
        const footer = this.addActor(FooterStyle.toManagedElement({
            tagName: "div",
            parentElement: cardLayoutWrapper.element
        }));
        const scrollArea = this.addActor(new web_1.ScrollArea({
            parentElement: outsideScrollArea.element,
            scrollPositionColor: color_1.Color.givenHexString("#888888"),
            direction: "vertical",
            anchorBottom: this.props.anchorBottom
        }));
        const insideScrollArea = this.addActor(InsideScrollAreaStyle.toManagedElement({
            tagName: "div",
            parentElement: scrollArea.element,
        }));
        this._contentElement = insideScrollArea.element;
        this._footerElement = footer.element;
        const measureFooter = this.addActor(new web_1.ElementSizeWatcher({
            element: footer.element,
        }));
        const measureInside = this.addActor(new web_1.ElementSizeWatcher({
            element: insideScrollArea.element,
        }));
        const heightBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            measureFooter.output,
            measureInside.output,
            this.listOrder,
            this.props.maxHeight,
        ]));
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            if (this.props.onRemoved != null) {
                this.props.onRemoved();
            }
        }));
        this.cancelOnDeactivate(heightBinding.didInvalidate.subscribe(() => {
            var _a, _b;
            const contentHeight = ((_a = measureInside.output.value) === null || _a === void 0 ? void 0 : _a.height) || 0;
            const footerHeight = ((_b = measureFooter.output.value) === null || _b === void 0 ? void 0 : _b.height) || 0;
            const listOrder = this.listOrder.value;
            const maxHeight = this.props.maxHeight.value;
            const requestedFooterHeight = footerHeight == 0 ? 0 : footerHeight + 15; // footer vertical padding
            const requestedContentHeight = contentHeight == 0 ? 5 : contentHeight + 20; // content vertical padding
            let marginTop = listOrder === 0 ? 0 : __1.headerAreaHeight;
            cardLayoutWrapper.style.marginTop = `${marginTop + 10}px`;
            let visibleContentHeight;
            if (maxHeight != null) {
                const maxContentHeight = maxHeight - marginTop;
                visibleContentHeight = Math.min(maxContentHeight, requestedContentHeight);
            }
            else {
                visibleContentHeight = requestedContentHeight;
            }
            this._cardHeight.setValue(marginTop + visibleContentHeight + requestedFooterHeight + 20);
            outsideScrollArea.style.height = `${visibleContentHeight}px`;
            cardLayoutWrapper.style.transform = `translateX(${listOrder * 100}%)`;
        }, true));
    }
}
exports.CardLayout = CardLayout;
const CardLayoutWrapper = web_1.ElementStyle.givenDefinition({
    elementDescription: "CardLayoutWrapper",
    css: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    background: #FFF;
  `,
});
const OutsideScrollAreaStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "OutsideScrollArea",
    css: `
    position: relative;
    margin: 0;
    flex-shrink: 0;
  `,
});
const InsideScrollAreaStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "InsideScrollArea",
    css: `
    background: #FFF;
    padding: 10px 20px;
    box-sizing: border-box;
    color: #000;
  `,
});
const FooterStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Footer",
    css: `
    padding: 5px 20px 10px 20px;
    box-sizing: border-box;
    flex-shrink: 0;
  `,
});
//# sourceMappingURL=CardLayout.js.map