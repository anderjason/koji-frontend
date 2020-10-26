import * as React from "react";
import { ReactComponents } from "../../../src";
const { Card, Button } = ReactComponents;

export interface ReactButtonDemoProps {}

export class ReactButtonDemo extends React.Component<
  ReactButtonDemoProps,
  any
> {
  render() {
    return (
      <Card>
        <Button />
      </Card>
    );
  }
}
