import { Actor } from "skytree";
import { ToggleButton } from "../..";
import { Observable } from "@anderjason/observable";

export interface ToggleAccessoryProps {
  parentElement: HTMLElement;
  defaultValue: boolean;
  onChange: (value: boolean) => void;
}

export class ToggleAccessory extends Actor<ToggleAccessoryProps> {
  private _isToggleActive: Observable<boolean>;

  constructor(props: ToggleAccessoryProps) {
    super(props);

    this._isToggleActive = Observable.givenValue(this.props.defaultValue || false);
  }

  forceToggleValue(): void {
    this._isToggleActive.setValue(!this._isToggleActive.value);
  }

  onActivate() {
    this.addActor(
      new ToggleButton({
        target: {
          type: "parentElement",
          parentElement: this.props.parentElement,
        },
        isActive: this._isToggleActive
      })
    )

    this.cancelOnDeactivate(
      this._isToggleActive.didChange.subscribe(isActive => {
        this.props.onChange(isActive);
      })
    );
  }
}
