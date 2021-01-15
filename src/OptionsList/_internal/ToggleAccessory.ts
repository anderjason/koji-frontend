import { Actor } from "skytree";
import { ToggleButton } from "../..";
import { Observable, ObservableDict } from "@anderjason/observable";

export interface ToggleAccessoryProps {
  parentElement: HTMLElement;
  propertyName: string;
  valuesByPropertyName: ObservableDict<any>;

  isDisabled?: boolean;
}

export class ToggleAccessory extends Actor<ToggleAccessoryProps> {
  onActivate() {
    const { propertyName, valuesByPropertyName } = this.props;

    const isToggleActive = Observable.ofEmpty<boolean>(Observable.isStrictEqual);

    this.addActor(
      new ToggleButton({
        target: {
          type: "parentElement",
          parentElement: this.props.parentElement,
        },
        isToggleActive,
        isDisabled: this.props.isDisabled
      })
    )

    this.cancelOnDeactivate(
      isToggleActive.didChange.subscribe(value => {
        valuesByPropertyName.setValue(propertyName, value);
      })
    );

    this.cancelOnDeactivate(
      valuesByPropertyName.didChange.subscribe(() => {
        isToggleActive.setValue(valuesByPropertyName.toOptionalValueGivenKey(propertyName) == true);
      }, true)
    )
  }
}
