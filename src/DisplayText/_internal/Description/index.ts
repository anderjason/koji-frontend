import { Observable, ObservableBase, ReadOnlyObservable } from "@anderjason/observable";
import { NumberUtil } from "@anderjason/util";
import { ElementSizeWatcher, ElementStyle, ManagedElement, Preload } from "@anderjason/web";
import { Actor, MultiBinding } from "skytree";

export interface DescriptionInputProps {
  parentElement: HTMLElement;
  text: ObservableBase<string>;
}

const lineHeight = 25;
const collapsedMaxHeight = 50;

export interface WordAndWhitespace {
  word: string;
  trailingWhitespace: string;
}

export function wordsAndWhitespaceGivenString(
  input: string
): WordAndWhitespace[] {
  if (input == null) {
    return [];
  }

  const re = /(\S+)(\s*)/g;

  const result: WordAndWhitespace[] = [];

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

export class Description extends Actor<DescriptionInputProps> {
  readonly isExpanded = Observable.givenValue(false, Observable.isStrictEqual);
  
  private _isContentExpandable = Observable.ofEmpty<boolean>(Observable.isStrictEqual);
  readonly isContentExpandable = ReadOnlyObservable.givenObservable(this._isContentExpandable);

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-text");

    this.cancelOnDeactivate(
      wrapper.addManagedEventListener("click", () => {
        this.isExpanded.setValue(!this.isExpanded.value);
      })
    );

    const contentArea = this.addActor(
      ContentStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );

    const textSpan = this.addActor(
      ManagedElement.givenDefinition({
        tagName: "span",
        parentElement: contentArea.element
      })
    );
    
    const label = this.addActor(
      LabelStyle.toManagedElement({
        tagName: "span",
        parentElement: contentArea.element,
        innerHTML: "label"
      })
    );

    const fontLoadedEventCount = Observable.givenValue(0);

    this.cancelOnDeactivate(
      Preload.instance.didLoadFont.subscribe(() => {
        fontLoadedEventCount.setValue(fontLoadedEventCount.value + 1);
      })
    );

    const range = document.createRange();

    const parentBoundsWatcher = this.addActor(
      new ElementSizeWatcher({
        element: this.props.parentElement,
      })
    );

    this.cancelOnDeactivate(
      this._isContentExpandable.didChange.subscribe(isExpandable => {
        wrapper.setModifier("isExpandable", isExpandable);
        label.setModifier("isExpandable", isExpandable);
      }, true)
    );

    const contentBinding = this.addActor(
      MultiBinding.givenAnyChange([
        this.isExpanded,
        this.isContentExpandable,
        this.props.text,
        parentBoundsWatcher.output,
        fontLoadedEventCount
      ])
    );

    this.cancelOnDeactivate(
      contentBinding.didInvalidate.subscribe(() => {
        textSpan.element.innerHTML = this.props.text.value;

        // set the content area to the minimum height for measurement
        contentArea.style.height = `${lineHeight}px`;
        const measuredTextHeight = contentArea.element.scrollHeight;

        // undo height change
        contentArea.style.height = "100%";

        // limit visible height when collapsed
        let visibleTextHeight: number;
        if (this.isExpanded.value == true) {
          visibleTextHeight = measuredTextHeight;
        } else  {
          visibleTextHeight = NumberUtil.numberWithHardLimit(
            measuredTextHeight,
            25,
            collapsedMaxHeight
          );
        }

        wrapper.style.height = `${visibleTextHeight}px`;

        this._isContentExpandable.setValue(measuredTextHeight > collapsedMaxHeight);
        
        if (this.isExpanded.value == true) {
          label.element.innerHTML = "&nbsp;less";
        } else {
          const wordsAndWhitespace = wordsAndWhitespaceGivenString(
            textSpan.element.textContent
          );

          const textNode = textSpan.element.firstChild;
          if (textNode == null) {
            return;
          }
          
          const contentBounds = contentArea.element.getBoundingClientRect();

          let start = 0;
          let end = 0;

          let collapsedWords: WordAndWhitespace[] = [];

          for (let i = 0; i < wordsAndWhitespace.length; i++) {
            const wordAndWhitespace = wordsAndWhitespace[i];

            end = start + wordAndWhitespace.word.length + wordAndWhitespace.trailingWhitespace.length;
            range.setStart(textNode, start);
            range.setEnd(textNode, end);

            const rect = range.getClientRects()[0];
            if (rect != null) {
              const x = rect.x - contentBounds.x + rect.width;
              const y = rect.y - contentBounds.y + rect.height;

              if (
                y > collapsedMaxHeight ||
                (y == collapsedMaxHeight && x > contentBounds.width - 100)
              ) {
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
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
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

const ContentStyle = ElementStyle.givenDefinition({
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

const LabelStyle = ElementStyle.givenDefinition({
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
