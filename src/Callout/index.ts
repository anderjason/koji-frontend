import { Point2 } from "@anderjason/geometry";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { ElementStyle, ScreenSize } from "@anderjason/web";
import { Actor, MultiBinding } from "skytree";
import { KojiTypography } from "../KojiTypography";

export type CalloutSide = "right" | "left";

export interface CalloutProps {
  calloutSide: Observable<CalloutSide>;
  parentElement: HTMLElement;
  screenPoint: Observable<Point2>;
  text: string;
}

export class Callout extends Actor<CalloutProps> {
  constructor(props: CalloutProps) {
    super(props);

    KojiTypography.preloadFonts();
  }

  onActivate() {
    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
        transitionOut: async () => {
          wrapper.removeModifier("isVisible");
          await Duration.givenSeconds(0.4).toDelay();
        },
      })
    );

    const span = document.createElement("span");
    span.innerHTML = this.props.text;
    wrapper.element.appendChild(span);

    const pointBinding = this.addActor(
      MultiBinding.givenAnyChange([
        this.props.screenPoint,
        this.props.calloutSide,
        ScreenSize.instance.availableSize,
      ])
    );

    this.cancelOnDeactivate(
      pointBinding.didInvalidate.subscribe(() => {
        if (this.isActive.value == false) {
          return;
        }

        const screenPoint = this.props.screenPoint.value;
        const calloutSide = this.props.calloutSide.value;
        const availableSize = ScreenSize.instance.availableSize.value;

        if (screenPoint == null || calloutSide == null) {
          return;
        }

        wrapper.style.top = `${screenPoint.y}px`;

        if (calloutSide === "right") {
          wrapper.style.left = `${screenPoint.x + 7}px`;
          wrapper.style.right = null;
        } else {
          wrapper.style.left = null;
          wrapper.style.right = `${availableSize.width - screenPoint.x + 7}px`;
        }

        wrapper.addModifier("isVisible");
      }, true)
    );

    this.cancelOnDeactivate(
      this.props.calloutSide.didChange.subscribe((calloutSide) => {
        if (calloutSide == null) {
          return;
        }

        wrapper.setModifier("isPointingLeft", calloutSide === "right");
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    animation: 1.4s ease 0s infinite normal none running bounce;
    background-color: rgb(0, 122, 255);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    opacity: 0;
    padding: 6px 12px;
    position: absolute;
    transition: all 0.4s ease-in-out;
    white-space: nowrap;
    will-change: transform, opacity;
    z-index: 1000;
    
    &:after {
      -webkit-box-align: center;
      align-items: center;
      border-color: transparent transparent transparent rgb(0, 122, 255);
      border-style: solid;
      border-width: 8px 0px 8px 10px;
      content: "";
      display: flex;
      height: 0px;
      position: absolute;
      right: -7px;
      top: calc(50% - 8px);
      width: 0px;
    }

    @keyframes bounce { 
      0% { 
        transform: translate(3px, -50%);
      }
      50% { 
        transform: translate(-3px, -50%);
      }
      100% { 
        transform: translate(3px, -50%);
      }
    }
  `,
  modifiers: {
    isVisible: `
      opacity: 1
    `,
    isPointingLeft: `
      &:after {
        border-color: transparent rgb(0, 122, 255) transparent transparent;  
        border-width: 8px 10px 8px 0px;
        left: -7px;
        right: auto;
      }
    `,
  },
});
