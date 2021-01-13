import { DemoActor } from "@anderjason/example-tools";
import { Observable, ObservableArray } from "@anderjason/observable";
import { AlignBottom, OptionsList } from "../../../src";
import { Card } from "../../../src/Card";
import { OptionsListItemData } from "../../../src/OptionsList";

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
        items: ObservableArray.givenValues<OptionsListItemData>([
          {
            label: "Who can post?",
            accessoryData: {
              type: "detail",
              text: Observable.givenValue("Everyone"),
              onClick: () => {}
            },
          },
          {
            label: "Advanced options",
            accessoryData: {
              type: "detail",
              text: Observable.ofEmpty(),
              onClick: () => {}
            },
          },
          {
            label: "Approve posts before they go live",
            accessoryData: {
              type: "toggle",
              isActive: Observable.givenValue<boolean>(false)
            },
          },
          {
            label: "Free",
            accessoryData: {
              type: "radio",
              key: "free",
              selectedKey: price
            },
          },
          {
            label: "Premium",
            accessoryData: {
              type: "radio",
              key: "premium",
              selectedKey: price
            },
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
