import { Color } from "@anderjason/color";
import { DemoActor } from "@anderjason/example-tools";
import { LoadingIndicator } from "../../../src/LoadingIndicator";

export class LoadingIndicatorDemo extends DemoActor<void> {
  onActivate() {
    this.addActor(
      new LoadingIndicator({
        parentElement: this.parentElement,
        color: Color.givenHexString("#FFFFFF"),
      })
    );
  }
}
