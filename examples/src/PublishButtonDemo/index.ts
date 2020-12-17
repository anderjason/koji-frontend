import { DemoActor } from "@anderjason/example-tools";
import { ElementStyle } from "@anderjason/web";
import { PublishButton } from "../../../src";

export class PublishButtonDemo extends DemoActor<void> {
  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    this.addActor(
      new PublishButton({
        parentElement: wrapper.element,
        onClick: () => {
          return "Please correct errors before continuing";
        },
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

