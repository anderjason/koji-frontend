import * as React from "react";
import { Actor } from "skytree";
import { KojiAppearance } from "../..";
import { Button as ButtonActor } from "../../Button";

export class Button extends React.PureComponent<any, any> {
  private _ref = React.createRef<HTMLButtonElement>();
  private _actor: Actor;

  componentDidMount() {
    this._actor = new ButtonActor({
      element: {
        type: "thisElement",
        element: this._ref.current,
      },
      buttonMode: "ready",
      onClick: () => {},
      text: "Unlock now",
      theme: KojiAppearance.themes.get("kojiBlack"),
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
    return <button ref={this._ref} />;
  }
}
