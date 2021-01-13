import { DemoActor } from "@anderjason/example-tools";
import { Observable, ObservableArray } from "@anderjason/observable";
import { AlignBottom, OptionsSummary } from "../../../src";
import { Card } from "../../../src/Card";
import { OptionsSummaryItemData } from "../../../src/OptionsSummary";

export class OptionsSummaryDemo extends DemoActor<void> {
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
    //     parentElement: card.baseElement,
    //     value: Observable.ofEmpty<string>(),
    //     displayTextGivenValue: v => v,
    //     valueGivenDisplayText: v => v
    //   })
    // );

    this.addActor(
      new OptionsSummary({
        parentElement: card.element,
        items: ObservableArray.givenValues<OptionsSummaryItemData>([
          {
            label: "Who can post?",
            accessoryData: {
              type: "text",
              text: Observable.givenValue("Everyone"),
              onClick: () => {}
            },
          },
          {
            label: "Who can view?",
            accessoryData: {
              type: "text",
              text: Observable.givenValue("Everyone"),
              onClick: () => {}
            },
          },
          {
            label: "Post types",
            accessoryData: {
              type: "text",
              text: Observable.givenValue("Everyone"),
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
        ])
      })
    );

    // this.addActor(
    //   new SubmitButton({
    //     target: {
    //       type: "parentElement",
    //       parentElement: card.baseFooterElement
    //     },
    //     text: "Purchase",
    //     buttonMode: "disabled",
    //     onClick: () => {}
    //   })
    // )
  }
}
