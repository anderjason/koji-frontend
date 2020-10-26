import * as React from "react";
import { Actor } from "skytree";
import { Card as CardActor } from "../../Card";

export class Card extends React.PureComponent<any, any> {
  private _ref = React.createRef<HTMLDivElement>();
  private _actor: Actor;

  componentDidMount() {
    this._actor = new CardActor({
      element: {
        type: "thisElement",
        element: this._ref.current,
      },
    });
    this._actor.activate();
  }

  componentWillUnmount() {
    if (this._actor != null) {
      this._actor.deactivate();
      this._actor = undefined;
    }
  }

  render() {
    return <div ref={this._ref}>{this.props.children}</div>;
  }
}
