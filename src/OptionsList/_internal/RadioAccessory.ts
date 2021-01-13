import { Actor } from "skytree";
import { Observable } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";

export interface RadioAccessoryProps {
  parentElement: HTMLElement;
  key: string;
  selectedKey: Observable<string>;
}

const checkSvg = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"></path></svg>`;

export class RadioAccessory extends Actor<RadioAccessoryProps> {
  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
        innerHTML: checkSvg
      })
    );

    this.cancelOnDeactivate(
      this.props.selectedKey.didChange.subscribe(selectedKey => {
        wrapper.setModifier("isVisible", selectedKey === this.props.key);
      }, true)
    )
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    opacity: 0;
    user-select: none;
    transition: 0.15s ease opacity;

    svg {
      color: #007AFF;
      margin-top: 4px;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
  `,
  modifiers: {
    isVisible: `
      opacity: 1;
    `
  }
});
