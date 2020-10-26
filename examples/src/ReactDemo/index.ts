import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Actor, ExclusiveActivator } from "skytree";
import { ReactBridge } from "../../../src/ReactBridge";

export interface ReactDemoProps {
  component: React.ComponentClass;
}

export class ReactDemo extends Actor<ReactDemoProps> implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    this.addActor(
      new ExclusiveActivator({
        input: this.parentElement,
        fn: (parentElement) => {
          if (parentElement == null) {
            return null;
          }

          return new ReactBridge({
            parentElement,
            component: this.props.component,
          });
        },
      })
    );
  }
}
