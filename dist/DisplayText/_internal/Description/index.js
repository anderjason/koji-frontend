"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = void 0;
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const lineHeight = 25;
const collapsedMaxHeight = 50;
const expandedMaxHeight = 150;
class Description extends skytree_1.Actor {
    constructor() {
        super(...arguments);
        this.isExpanded = observable_1.Observable.givenValue(false, observable_1.Observable.isStrictEqual);
    }
    onActivate() {
        const wrapper = this.addActor(WrapperStyle.toManagedElement({
            tagName: "div",
            parentElement: this.props.parentElement,
        }));
        wrapper.element.classList.add("kft-text");
        this.cancelOnDeactivate(wrapper.addManagedEventListener("click", () => {
            this.isExpanded.setValue(!this.isExpanded.value);
        }));
        const content = this.addActor(ContentStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        const heightBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([this.isExpanded, this.props.text]));
        this.cancelOnDeactivate(heightBinding.didInvalidate.subscribe(() => {
            content.element.innerHTML = this.props.text.value;
            content.style.height = `${lineHeight}px`;
            const contentHeight = content.element.scrollHeight;
            content.style.height = "100%";
            const maxHeight = this.isExpanded.value == true
                ? expandedMaxHeight
                : collapsedMaxHeight;
            const wrapperHeight = util_1.NumberUtil.numberWithHardLimit(contentHeight, 25, maxHeight);
            wrapper.style.height = `${wrapperHeight}px`;
        }, true));
        const range = document.createRange();
        const parentBoundsWatcher = this.addActor(new web_1.ElementSizeWatcher({
            element: this.props.parentElement,
        }));
        const sizeBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            this.isExpanded,
            this.props.text,
            parentBoundsWatcher.output,
        ]));
        this.cancelOnDeactivate(sizeBinding.didInvalidate.subscribe(() => {
            wrapper.element.scrollTo(0, 0);
            wrapper.setModifier("isExpanded", this.isExpanded.value);
            if (this.isExpanded.value == false) {
                content.element.innerHTML = this.props.text.value;
                const words = content.element.textContent.split(" ");
                const textNode = content.element.firstChild;
                if (textNode == null) {
                    return;
                }
                const contentBounds = content.element.getBoundingClientRect();
                let start = 0;
                let end = 0;
                let collapsedWords = [];
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    end = start + word.length;
                    range.setStart(textNode, start);
                    range.setEnd(textNode, end);
                    const rect = range.getClientRects()[0];
                    if (rect != null) {
                        const x = rect.x - contentBounds.x + rect.width;
                        const y = rect.y - contentBounds.y + rect.height;
                        if (y == collapsedMaxHeight && x > contentBounds.width - 100) {
                            break;
                        }
                        collapsedWords.push(word);
                    }
                    start = end + 1;
                }
                if (collapsedWords.length < words.length) {
                    wrapper.setModifier("isExpandable", true);
                    const span = document.createElement("span");
                    let trimmedText = collapsedWords.join(" ");
                    trimmedText = trimmedText.replace(/(.*?)\W+$/, "$1");
                    span.innerHTML = trimmedText + "...&nbsp;";
                    const more = document.createElement("span");
                    more.style.color = "#BDBDBD";
                    more.innerHTML = "more";
                    content.element.innerHTML = "";
                    content.element.appendChild(span);
                    content.element.appendChild(more);
                }
                else {
                    wrapper.setModifier("isExpandable", false);
                }
            }
        }, true));
    }
}
exports.Description = Description;
const WrapperStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Wrapper",
    css: `
    border: none;
    color: #2D2F30;
    grid-area: description;
    overflow: hidden;
    user-select: none;
    white-space: pre-wrap;
    transition: 0.5s ease height;
  `,
    modifiers: {
        isExpandable: `
      cursor: pointer;
    `,
        isExpanded: `
      overflow-y: auto;
    `,
    },
});
const ContentStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Content",
    css: `
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
    text-align: left;
  `,
});
//# sourceMappingURL=index.js.map