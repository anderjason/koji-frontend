import { Actor } from "skytree";
import { ElementStyle, SequentialChoice } from "@anderjason/web";
import { Description } from "../../../src/Description";
import { Observable } from "@anderjason/observable";
import { Card } from "../../../src/Card";
import { DemoActor } from "@anderjason/example-tools";
import { AlignBottom } from "../../../src";

export interface DescriptionDemoProps {}

interface DescriptionState {
  isExpanded: boolean;
  text: string;
}

export class DescriptionDemo
  extends Actor<DescriptionDemoProps>
  implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing: false,
      })
    );

    const card = this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
      })
    );

    const states = new SequentialChoice<DescriptionState>({
      options: [
        {
          isExpanded: false,
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
          isExpanded: true,
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      ],
    });

    const text = Observable.givenValue("Hello world");

    const description = this.addActor(
      new Description({
        parentElement: card.element,
        text,
      })
    );

    this.cancelOnDeactivate(
      states.currentOption.didChange.subscribe((state) => {
        description.isExpanded.setValue(state.isExpanded);
        text.setValue(state.text);
      }, true)
    );
  }
}
