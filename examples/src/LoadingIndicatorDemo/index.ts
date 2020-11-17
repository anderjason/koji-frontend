import { Color } from "@anderjason/color";
import { DemoActor } from "@anderjason/example-tools";
import { LoadingIndicator } from "../../../src/LoadingIndicator";

export interface LoadingIndicatorDemoProps {}

export class LoadingIndicatorDemo extends DemoActor<LoadingIndicatorDemoProps> {
  onActivate() {
    this.addActor(
      new LoadingIndicator({
        parentElement: this.parentElement,
        color: Color.givenHexString("#FFFFFF"),
      })
    );
  }
}
