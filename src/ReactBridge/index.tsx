import * as React from "react";
import * as ReactDOM from "react-dom";
import { Observable, Receipt } from "@anderjason/observable";
import { Actor } from "skytree";

export interface ReactBridgeProps {
  parentElement: HTMLElement;
  component: React.ComponentClass;

  props?: {
    [key: string]: any;
  };
}

export class ReactBridge extends Actor<ReactBridgeProps> {
  onActivate() {
    if (this.props.props != null) {
      Object.keys(this.props.props).forEach((key) => {
        const val = this.props.props[key];

        if (Observable.isObservable(val)) {
          this.cancelOnDeactivate(val.didChange.subscribe(this.render));
        }
      });
    }

    this.cancelOnDeactivate(
      new Receipt(() => {
        ReactDOM.unmountComponentAtNode(this.props.parentElement);
      })
    );

    this.render();
  }

  render() {
    const props: any = {};

    if (this.props.props != null) {
      Object.keys(this.props.props).forEach((key) => {
        const val = this.props.props[key];

        if (Observable.isObservable(val)) {
          props[key] = val.value;
        } else {
          props[key] = val;
        }
      });
    }

    ReactDOM.render(
      React.createElement(this.props.component, props),
      this.props.parentElement
    );
  }
}
