import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { AlignBottom, OptionsList } from "../../../src";
import { Card } from "../../../src/Card";
import { OptionDefinition } from "../../../src/OptionsList";

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

    const price = Observable.givenValue<string>("free");

    this.addActor(
      new OptionsList({
        parentElement: card.element,
        options: Observable.givenValue<OptionDefinition[]>([
          {
            key: "who",
            label: "Who can post?",
            type: "detail",
            text: "Everyone",
            onClick: () => {}
          },
          {
            key: "options",
            label: "Advanced options",
            type: "detail",
            onClick: () => {}
          },
          {
            key: "approve",
            type: "toggle",
            label: "Approve posts before they go live",
            defaultValue: false,
            onChange: () => {}
          },
          {
            key: "free",
            type: "radio",
            label: "Free",
            selectedKey: price
          },
          {
            key: "premium",
            label: "Premium",
            type: "radio",
            selectedKey: price
          },
        ])
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
