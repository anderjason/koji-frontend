import { Actor } from "skytree";
import { ToggleButton } from "../..";
import { Observable } from "@anderjason/observable";

export interface ToggleAccessoryProps {
  parentElement: HTMLElement;
  isActive: Observable<boolean>;
}

export class ToggleAccessory extends Actor<ToggleAccessoryProps> {
  onActivate() {
    this.addActor(
      new ToggleButton({
        target: {
          type: "parentElement",
          parentElement: this.props.parentElement,
        },
        isActive: this.props.isActive
      })
    )
  }
}
