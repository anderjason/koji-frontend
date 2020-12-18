import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { ElementStyle, SequentialChoice } from "@anderjason/web";
import { Timer } from "skytree";
import { PublishButton } from "../../../src";
import { PublishButtonMode } from "../../../src/PublishButton";

export class PublishButtonDemo extends DemoActor<void> {
  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    const modes = new SequentialChoice<PublishButtonMode>({
      options: [
        {
          type: "ready"
        },
        {
          type: "busy"
        },
        {
          type: "error",
          errorText: "Please correct errors before continuing"
        }
      ]
    });

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(2),
        isRepeating: true,
        fn: () => {
          modes.selectNextOption();
        }
      })
    );
    
    this.addActor(
      new PublishButton({
        parentElement: wrapper.element,
        onClick: () => {},
        mode: modes.currentOption
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    height: 100%;
    position: relative;
    width: 100%;
  `,
});

