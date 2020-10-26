import { Observable } from "@anderjason/observable";
import { NumberUtil } from "@anderjason/util";
import { ElementSizeWatcher, ElementStyle } from "@anderjason/web";
import { Actor, MultiBinding } from "skytree";

export interface DescriptionInputProps {
  parentElement: HTMLElement;
  text: Observable<string>;
}

const lineHeight = 25;
const collapsedMaxHeight = 50;
const expandedMaxHeight = 150;

export class Description extends Actor<DescriptionInputProps> {
  readonly isExpanded = Observable.givenValue(false, Observable.isStrictEqual);

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    this.cancelOnDeactivate(
      wrapper.addManagedEventListener("click", () => {
        this.isExpanded.setValue(!this.isExpanded.value);
      })
    );

    const content = this.addActor(
      ContentStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );

    const heightBinding = this.addActor(
      MultiBinding.givenAnyChange([this.isExpanded, this.props.text])
    );

    this.cancelOnDeactivate(
      heightBinding.didInvalidate.subscribe(() => {
        content.element.innerHTML = this.props.text.value;

        content.style.height = `${lineHeight}px`;
        const contentHeight = content.element.scrollHeight;

        content.style.height = "100%";

        const maxHeight =
          this.isExpanded.value == true
            ? expandedMaxHeight
            : collapsedMaxHeight;

        const wrapperHeight = NumberUtil.numberWithHardLimit(
          contentHeight,
          25,
          maxHeight
        );
        wrapper.style.height = `${wrapperHeight}px`;
      }, true)
    );

    const range = document.createRange();

    const parentBoundsWatcher = this.addActor(
      new ElementSizeWatcher({
        element: this.props.parentElement,
      })
    );

    const sizeBinding = this.addActor(
      MultiBinding.givenAnyChange([
        this.isExpanded,
        this.props.text,
        parentBoundsWatcher.output,
      ])
    );

    this.cancelOnDeactivate(
      sizeBinding.didInvalidate.subscribe(() => {
        wrapper.element.scrollTo(0, 0);
        wrapper.setModifier("isExpanded", this.isExpanded.value);

        if (this.isExpanded.value == false) {
          content.element.innerHTML = this.props.text.value;
          const words = content.element.textContent.split(" ");
          const textNode = content.element.firstChild;
          const contentBounds = content.element.getBoundingClientRect();

          let start = 0;
          let end = 0;

          let collapsedWords: string[] = [];

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
            wrapper.addModifier("isExpandable");
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
          } else {
            wrapper.removeModifier("isExpandable");
          }
        }
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    border: none;
    color: #2D2F30;
    grid-area: description;
    overflow: hidden;
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

const ContentStyle = ElementStyle.givenDefinition({
  css: `
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
  `,
});
