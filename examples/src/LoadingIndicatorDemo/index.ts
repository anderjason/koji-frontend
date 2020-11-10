import { Color } from "@anderjason/color";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Actor } from "skytree";
import { LoadingIndicator } from "../../../src/LoadingIndicator";

export interface LoadingIndicatorDemoProps {}

export class LoadingIndicatorDemo
  extends Actor<LoadingIndicatorDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    this.addActor(
      new LoadingIndicator({
        parentElement: this.parentElement,
        color: Color.givenHexString("#FFFFFF"),
      })
    );
  }
}
