import { Actor } from "skytree";
import { ValuePath } from "@anderjason/util";
import { ThemeToolbar } from "../../../src/ThemeToolbar";
import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Koji } from "../../../src/Koji";

export interface ThemeToolbarDemoProps {}

export class ThemeToolbarDemo
  extends Actor<ThemeToolbarDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    this.addActor(
      new ThemeToolbar({
        parentElement: this.parentElement,
      })
    );
  }
}
