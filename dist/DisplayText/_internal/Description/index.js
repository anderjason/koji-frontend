"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = exports.wordsAndWhitespaceGivenString = void 0;
const observable_1 = require("@anderjason/observable");
const util_1 = require("@anderjason/util");
const web_1 = require("@anderjason/web");
const skytree_1 = require("skytree");
const lineHeight = 25;
const collapsedMaxHeight = 50;
function wordsAndWhitespaceGivenString(input) {
    if (input == null) {
        return [];
    }
    const re = /(\S+)(\s*)/g;
    const result = [];
    let match;
    do {
        match = re.exec(input);
        if (match) {
            result.push({
                word: match[1],
                trailingWhitespace: match[2],
            });
        }
    } while (match);
    return result;
}
exports.wordsAndWhitespaceGivenString = wordsAndWhitespaceGivenString;
class Description extends skytree_1.Actor {
    constructor() {
        super(...arguments);
        this.isExpanded = observable_1.Observable.givenValue(false, observable_1.Observable.isStrictEqual);
        this._isContentExpandable = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        this.isContentExpandable = observable_1.ReadOnlyObservable.givenObservable(this._isContentExpandable);
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
        const contentArea = this.addActor(ContentStyle.toManagedElement({
            tagName: "div",
            parentElement: wrapper.element,
        }));
        const textSpan = this.addActor(web_1.ManagedElement.givenDefinition({
            tagName: "span",
            parentElement: contentArea.element
        }));
        const label = this.addActor(LabelStyle.toManagedElement({
            tagName: "span",
            parentElement: contentArea.element,
            innerHTML: "label"
        }));
        const fontLoadedEventCount = observable_1.Observable.givenValue(0);
        this.cancelOnDeactivate(web_1.Preload.instance.didLoadFont.subscribe(() => {
            fontLoadedEventCount.setValue(fontLoadedEventCount.value + 1);
        }));
        const range = document.createRange();
        const parentBoundsWatcher = this.addActor(new web_1.ElementSizeWatcher({
            element: this.props.parentElement,
        }));
        this.cancelOnDeactivate(this._isContentExpandable.didChange.subscribe(isExpandable => {
            wrapper.setModifier("isExpandable", isExpandable);
            label.setModifier("isExpandable", isExpandable);
        }, true));
        const contentBinding = this.addActor(skytree_1.MultiBinding.givenAnyChange([
            this.isExpanded,
            this.isContentExpandable,
            this.props.text,
            parentBoundsWatcher.output,
            fontLoadedEventCount
        ]));
        this.cancelOnDeactivate(contentBinding.didInvalidate.subscribe(() => {
            textSpan.element.innerHTML = this.props.text.value;
            // set the content area to the minimum height for measurement
            contentArea.style.height = `${lineHeight}px`;
            const measuredTextHeight = contentArea.element.scrollHeight;
            // undo height change
            contentArea.style.height = "100%";
            // limit visible height when collapsed
            let visibleTextHeight;
            if (this.isExpanded.value == true) {
                visibleTextHeight = measuredTextHeight;
            }
            else {
                visibleTextHeight = util_1.NumberUtil.numberWithHardLimit(measuredTextHeight, 25, collapsedMaxHeight);
            }
            wrapper.style.height = `${visibleTextHeight}px`;
            this._isContentExpandable.setValue(measuredTextHeight > collapsedMaxHeight);
            if (this.isExpanded.value == true) {
                label.element.innerHTML = "&nbsp;less";
            }
            else {
                const wordsAndWhitespace = wordsAndWhitespaceGivenString(textSpan.element.textContent);
                const textNode = textSpan.element.firstChild;
                if (textNode == null) {
                    return;
                }
                const contentBounds = contentArea.element.getBoundingClientRect();
                let start = 0;
                let end = 0;
                let collapsedWords = [];
                for (let i = 0; i < wordsAndWhitespace.length; i++) {
                    const wordAndWhitespace = wordsAndWhitespace[i];
                    end = start + wordAndWhitespace.word.length + wordAndWhitespace.trailingWhitespace.length;
                    range.setStart(textNode, start);
                    range.setEnd(textNode, end);
                    const rect = range.getClientRects()[0];
                    if (rect != null) {
                        const x = rect.x - contentBounds.x + rect.width;
                        const y = rect.y - contentBounds.y + rect.height;
                        if (y > collapsedMaxHeight ||
                            (y == collapsedMaxHeight && x > contentBounds.width - 100)) {
                            break;
                        }
                        collapsedWords.push(wordAndWhitespace);
                    }
                    start = end;
                }
                if (collapsedWords.length < wordsAndWhitespace.length) {
                    let trimmedText = collapsedWords
                        .map((ww) => ww.word + ww.trailingWhitespace)
                        .join("");
                    trimmedText = trimmedText.replace(/(.*?)\W+$/, "$1");
                    textSpan.element.innerHTML = trimmedText + "...";
                    label.element.innerHTML = "&nbsp;more";
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
    overflow: hidden;
    user-select: none;
    white-space: pre-wrap;
    position: relative;
    transition: 0.4s cubic-bezier(.5,0,.3,1) height;
    -webkit-tap-highlight-color: transparent;
  `,
    modifiers: {
        isExpandable: `
      cursor: pointer;
    `,
    },
});
const ContentStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Content",
    css: `
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
    text-align: left;
  `,
});
const LabelStyle = web_1.ElementStyle.givenDefinition({
    elementDescription: "Label",
    css: `
    color: #BDBDBD;
    display: none;
  `,
    modifiers: {
        isExpandable: `
      display: inline;
    `,
    },
});
//# sourceMappingURL=index.js.map