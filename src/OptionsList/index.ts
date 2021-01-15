import {
  Dict,
  Observable,
  ObservableArray,
  ObservableBase,
  ObservableDict,
} from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor, ArrayActivator, ExclusiveActivator } from "skytree";
import { KojiAppearance } from "..";
import { LineItem } from "./_internal/LineItem";

export interface DetailOptionDefinition {
  type: "detail";
  label: string;
  onClick: () => void;

  summaryText?: string;
}

export interface ToggleOptionDefinition {
  type: "toggle";
  label: string;
  propertyName: string;
  
  isDisabled?: boolean;
}

export interface RadioOptionDefinition {
  type: "radio";
  label: string;
  propertyName: string;
  propertyValue: string;
}

export type OptionDefinition =
  | DetailOptionDefinition
  | ToggleOptionDefinition
  | RadioOptionDefinition;

export interface OptionsListProps {
  parentElement: HTMLElement;
  definitions: OptionDefinition[] | ObservableBase<OptionDefinition[]>;
  defaultValues: Dict<any>;
  onChange: (key: string, value: any) => void;
}

export class OptionsList extends Actor<OptionsListProps> {
  private _definitions: ObservableBase<OptionDefinition[]>;
  
  constructor(props: OptionsListProps) {
    super(props);

    KojiAppearance.preloadFonts();

    this._definitions = Observable.givenValueOrObservable(this.props.definitions);
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );
    wrapper.element.classList.add("kft-control");

    const valuesByPropertyName = ObservableDict.givenValues<any>(
      this.props.defaultValues || {}
    );

    this.cancelOnDeactivate(
      valuesByPropertyName.didChangeSteps.subscribe((steps) => {
        steps.forEach((step) => {
          this.props.onChange(step.key, step.newValue);
        });
      })
    );

    this.addActor(
      new ExclusiveActivator({
        input: this._definitions,
        fn: (definitions) => {
          return new ArrayActivator({
            input: definitions,
            fn: (optionDefinition) => {
              return new LineItem({
                parentElement: wrapper.element,
                optionDefinition,
                valuesByPropertyName,
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
  `,
});
