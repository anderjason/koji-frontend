import { Actor, Timer } from "skytree";
import { ElementStyle } from "@anderjason/web";
import { Callout } from "../../../src/Callout";
import { Observable } from "@anderjason/observable";
import { Box2, Point2, Size2 } from "@anderjason/geometry";
import { Duration } from "@anderjason/time";
import { NumberUtil } from "@anderjason/util";
import { DemoActor } from "@anderjason/example-tools";

export interface CalloutDemoProps {}

export class CalloutDemo extends Actor<CalloutDemoProps> implements DemoActor {
  readonly parentElement = Observable.ofEmpty<HTMLElement>();
  readonly isVisible = Observable.ofEmpty<boolean>();

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    const indicator = this.addActor(
      IndicatorStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );

    const targetBox = Observable.ofEmpty<Box2>(Box2.isEqual);

    const setPoint = () => {
      if (this.parentElement.value == null) {
        return;
      }

      const relativeBounds = this.parentElement.value.getBoundingClientRect();

      const box = Box2.givenDomRect(wrapper.element.getBoundingClientRect());

      const offsetX = NumberUtil.numberWithRangeMap(
        Math.random(),
        0,
        1,
        -200,
        200
      );

      const offsetY = NumberUtil.numberWithRangeMap(
        Math.random(),
        0,
        1,
        -200,
        200
      );

      targetBox.setValue(
        Box2.givenCenterSize(
          Point2.givenXY(
            box.center.x - relativeBounds.x + offsetX,
            box.center.y - relativeBounds.y + offsetY
          ),
          Size2.givenWidthHeight(30, 30)
        )
      );
    };

    setPoint();

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(4),
        isRepeating: true,
        fn: () => {
          setPoint();
        },
      })
    );

    this.cancelOnDeactivate(
      targetBox.didChange.subscribe(() => {
        let { x, y } = targetBox.value.center;

        indicator.style.transform = `translate(${x}px, ${y}px)`;
      }, true)
    );

    this.addActor(
      new Callout({
        parentElement: wrapper.element,
        text: "Add images and text",
        targetBox,
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    height: 100%;
    position: relative;
    width: 100%;
  `,
});

const IndicatorStyle = ElementStyle.givenDefinition({
  css: `
    background: rgba(255,255,255,0.1);
    border-radius: 6px;
    height: 30px;
    left: -15px;
    position: absolute;
    top: -15px;
    width: 30px;
    z-index: 100;
  `,
});
