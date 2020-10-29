import { Actor, ConditionalActivator, Timer } from "skytree";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { ConfirmationPrompt } from "../../../src/ConfirmationPrompt";
import { ElementStyle } from "@anderjason/web";
import { Duration } from "@anderjason/time";

export interface ConfirmationPromptDemoProps {}

export class ConfirmationPromptDemo
  extends Actor<ConfirmationPromptDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const background = this.addActor(
      BackgroundStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    const showPrompt = Observable.givenValue(true);

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(2),
        isRepeating: true,
        fn: () => {
          showPrompt.setValue(!showPrompt.value);
        },
      })
    );

    this.addActor(
      new ConditionalActivator({
        input: showPrompt,
        fn: (v) => v,
        actor: new ConfirmationPrompt({
          parentElement: background.element,
          title: "Lorem ipsum",
          description:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
          confirmText: "Yes, confirm",
          cancelText: "No, cancel",
          isConfirmDestructive: true,
          onConfirm: () => {
            showPrompt.setValue(false);
          },
          onCancel: () => {
            showPrompt.setValue(false);
          },
        }),
      })
    );
  }
}

const BackgroundStyle = ElementStyle.givenDefinition({
  css: `
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    background: linear-gradient(to bottom right, red, blue);
  `,
});
