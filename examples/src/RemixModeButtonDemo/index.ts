import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { Koji } from "../../../src/Koji";
import { RemixModeButton } from "../../../src/RemixModeButton";

export interface RemixModeButtonDemoProps {}

export class RemixModeButtonDemo
  extends Actor<RemixModeButtonDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    Koji.instance.mode.setValue("template");

    this.addActor(
      new RemixModeButton({
        parentElement: wrapper.element,
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    width: 100%;
    height: 100%;
    position: relative;
  `,
});
