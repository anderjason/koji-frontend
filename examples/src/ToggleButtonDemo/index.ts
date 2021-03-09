import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { ManagedElement } from "@anderjason/web";
import { AlignBottom, Card, ToggleButton } from "../../../src";

export class ToggleButtonDemo extends DemoActor<void> {
  onActivate() {
    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing: false,
      })
    );

    const card = this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
      })
    );

    const isToggleActive = Observable.givenValue<boolean>(false);

    this.addActor(
      new ToggleButton({
        target: {
          type: "parentElement",
          parentElement: card.element
        },
        isToggleActive,
      })
    );

    const label = this.addActor(
      ManagedElement.givenDefinition({
        tagName: "div",
        parentElement: card.element
      })
    );

    this.cancelOnDeactivate(
      isToggleActive.didChange.subscribe(isActive => {
        label.element.innerHTML = isActive ? "ON" : "OFF";
      }, true)
    );
  }
}
