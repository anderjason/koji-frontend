import { Observable  } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor, ArrayActivator, ExclusiveActivator } from "skytree";
import { KojiAppearance } from "..";
import { LineItem } from "./_internal/LineItem";

export interface DetailOptionDefinition {
  key: string;
  type: "detail";
  label: string;
  onClick: () => void;
  text?: string;
}

export interface ToggleOptionDefinition {
  key: string;
  type: "toggle";
  label: string;
  defaultValue: boolean;
  onChange: (value: boolean) => void;
}

export interface RadioOptionDefinition {
  key: string;
  type: "radio";
  label: string;
  selectedKey: Observable<string>;
}

export type OptionDefinition = DetailOptionDefinition | ToggleOptionDefinition | RadioOptionDefinition;

export interface OptionsListProps {
  parentElement: HTMLElement;
  options: Observable<OptionDefinition[]>;
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
      new ExclusiveActivator({
        input: this.props.options,
        fn: optionDefinitions => {
          return new ArrayActivator({
            input: optionDefinitions,
            fn: (optionDefinition) => {
              return new LineItem({
                parentElement: wrapper.element,
                optionDefinition
              });
            },
          })
        }
      })
    )
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    margin: -10px -20px -10px 0;
  `
});
