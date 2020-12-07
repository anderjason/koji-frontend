import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { ElementStyle } from "@anderjason/web";
import { ConditionalActivator, Timer } from "skytree";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";

export interface AlignBottomDemoProps {}

export class AlignBottomDemo extends DemoActor<AlignBottomDemoProps> {
  onActivate() {
    const isRemixing = Observable.givenValue(false);

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(3),
        isRepeating: true,
        fn: () => {
          isRemixing.setValue(!isRemixing.value);
        },
      })
    );

    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing,
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

    const content = this.addActor(
      PlaceholderContentStyle.toManagedElement({
        tagName: "div",
        parentElement: card.baseElement,
      })
    );

    this.cancelOnDeactivate(
      isRemixing.didChange.subscribe((v) => {
        content.element.innerHTML = v ? "Remix mode" : "Normal mode";
      }, true)
    );

    this.addActor(
      new ConditionalActivator({
        input: isRemixing,
        fn: (v) => v,
        actor: KojiButtonStyle.toManagedElement({
          tagName: "div",
          parentElement: this.parentElement,
          transitionOut: async (el) => {
            el.setModifier("isVisible", false);
          },
          transitionIn: (el) => {
            el.setModifier("isVisible", true);
          },
        }),
      })
    );
  }
}

const PlaceholderContentStyle = ElementStyle.givenDefinition({
  css: `
    color: #000;
    text-align: center;
  `,
});

const KojiButtonStyle = ElementStyle.givenDefinition({
  css: `
    background: #007aff;
    border-radius: 50%;
    bottom: 16px;
    height: 48px;
    position: absolute;
    right: 16px;
    width: 48px;
    opacity: 0;
    transition: 0.4s ease-in all;
  `,
  modifiers: {
    isVisible: `
      opacity: 1;
    `,
  },
});
