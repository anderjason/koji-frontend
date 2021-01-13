import { ObservableArray } from "@anderjason/observable";
import { ManagedElement } from "@anderjason/web";
import { Actor, ArrayActivator } from "skytree";
import { KojiAppearance } from "..";
import { LineItem, LineItemAccessoryData } from "./_internal/LineItem";

export interface OptionsSummaryItemData {
  label: string;
  accessoryData: LineItemAccessoryData;
}

export interface OptionsSummaryProps {
  parentElement: HTMLElement;
  items: ObservableArray<OptionsSummaryItemData>;
}

export class OptionsSummary extends Actor<OptionsSummaryProps> {
  constructor(props: OptionsSummaryProps) {
    super(props);

    KojiAppearance.preloadFonts();
  }

  onActivate() {
    const wrapper = this.addActor(
      ManagedElement.givenDefinition({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-control");

    this.addActor(
      new ArrayActivator({
        input: this.props.items,
        fn: (item) => {
          console.log(item);
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
