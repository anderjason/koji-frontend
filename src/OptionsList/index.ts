import { ObservableArray } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor, ArrayActivator } from "skytree";
import { KojiAppearance } from "..";
import { LineItem, LineItemAccessoryData } from "./_internal/LineItem";

export interface OptionsListItemData {
  label: string;
  accessoryData: LineItemAccessoryData;
}

export interface OptionsListProps {
  parentElement: HTMLElement;
  items: ObservableArray<OptionsListItemData>;
}

export class OptionsList extends Actor<OptionsListProps> {
  constructor(props: OptionsListProps) {
    super(props);

    KojiAppearance.preloadFonts();
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-control");

    this.addActor(
      new ArrayActivator({
        input: this.props.items,
        fn: (item) => {
          return new LineItem({
            parentElement: wrapper.element,
            label: item.label,
            accessoryData: item.accessoryData,
          });
        },
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    margin: -10px -20px -10px 0;
  `
});
