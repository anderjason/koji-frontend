import { DemoActor } from "@anderjason/example-tools";
import { ObservableArray } from "@anderjason/observable";
import { AlignBottom, OptionsList } from "../../../src";
import { Card } from "../../../src/Card";
import {
  DetailOptionDefinition,
  OptionDefinition,
} from "../../../src/OptionsList";

export class OptionsListDemo extends DemoActor<void> {
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

    // this.addActor(
    //   new FloatLabelTextarea({
    //     parentElement: card.element,
    //     placeholderLabel: "Description",
    //     value: Observable.ofEmpty<string>(),
    //     displayTextGivenValue: v => v,
    //     valueGivenDisplayText: v => v
    //   })
    // );

    this.addActor(
      new OptionsList({
        parentElement: card.element,
        defaultValues: {
          price: "premium",
          approve: true,
        },
        onChange: (key: string, value: any): void => {
          console.log(`${key}=${value}`);
        },
        definitions: [
          {
            label: "Who can post?",
            type: "detail",
            summaryText: "Everyone",
            onClick: () => {},
          },
          {
            label: "Advanced options",
            type: "detail",
            onClick: () => {},
          },
          {
            type: "toggle",
            label: "Approve posts before they go live",
            propertyName: "approve",
          },
          {
            type: "radio",
            label: "Free",
            propertyName: "price",
            propertyValue: "free",
          },
          {
            label: "Premium",
            type: "radio",
            propertyName: "price",
            propertyValue: "premium",
          },
        ],
      })
    );

    // this.addActor(
    //   new SubmitButton({
    //     target: {
    //       type: "parentElement",
    //       parentElement: card.footerElement
    //     },
    //     text: "Purchase",
    //     buttonMode: "disabled",
    //     onClick: () => {}
    //   })
    // )
  }
}
