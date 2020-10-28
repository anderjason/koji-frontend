import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { StringUtil } from "@anderjason/util";
import { ElementSizeWatcher, ElementStyle, Pointer } from "@anderjason/web";
import {
  Actor,
  ConditionalActivator,
  DelayActivator,
  MultiBinding,
} from "skytree";
import { Callout } from "../Callout";
import { Koji } from "../Koji";
import { Box2, Point2 } from "@anderjason/geometry";

export interface RemixModeButtonDefinition {
  parentElement: HTMLElement | Observable<HTMLElement>;
}

function createToggleSwitchSvg(): string {
  const filterId = StringUtil.stringOfRandomCharacters(8);

  return `
    <svg width="59" height="36" viewBox="0 0 47 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g class="shadow" filter="url(#${filterId})">
        <rect
          x="3"
          y="3.5"
          width="41"
          height="22"
          rx="11"
          stroke="#fff"
          stroke-width="1.5"
        />
        <ellipse class="ellipse" cx="14.5" cy="14.5" rx="9.5" ry="9" fill="#fff" />
      </g>
      <g>
        <rect
          class="rect"
          x="3"
          y="3.5"
          width="41"
          height="22"
          rx="11"
          stroke="#fff"
          stroke-width="1.5"
          fill="transparent"
        />
        <ellipse class="ellipse" cx="14.5" cy="14.5" rx="9.5" ry="9" fill="#fff" />
      </g>
      <defs>
        <filter
          id="${filterId}"
          x=".25"
          y=".75"
          width="46.5"
          height="27.5"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur id="blur1" stdDeviation="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  `;
}

export class RemixModeButton extends Actor<RemixModeButtonDefinition> {
  onActivate() {
    const button = this.addActor(
      ButtonStyle.toManagedElement({
        tagName: "button",
        parentElement: this.props.parentElement,
      })
    );

    const shouldShowCallout = Observable.ofEmpty<boolean>(
      Observable.isStrictEqual
    );

    const parentSizeWatcher = this.addActor(
      new ElementSizeWatcher({
        element: this.props.parentElement,
      })
    );

    const buttonSizeWatcher = this.addActor(
      new ElementSizeWatcher({
        element: button.element,
      })
    );

    const sizeBinding = this.addActor(
      MultiBinding.givenAnyChange([
        parentSizeWatcher.output,
        buttonSizeWatcher.output,
      ])
    );

    const bounds = Observable.ofEmpty<Box2>(Box2.isEqual);

    this.cancelOnDeactivate(
      sizeBinding.didInvalidate.subscribe(() => {
        const buttonSize = buttonSizeWatcher.output.value;
        const parentSize = parentSizeWatcher.output.value;

        if (buttonSize == null || parentSize == null) {
          return;
        }

        const left = 16;
        const bottom = parentSize.height - 16;

        bounds.setValue(
          Box2.givenOppositeCorners(
            Point2.givenXY(left, bottom),
            Point2.givenXY(
              left + buttonSize.width,
              bottom - buttonSize.height - 4
            )
          )
        );
      }, true)
    );

    this.addActor(
      new ConditionalActivator({
        input: shouldShowCallout,
        fn: (v) => v,
        actor: new DelayActivator({
          activateAfter: Duration.givenSeconds(0.1),
          actor: new Callout({
            parentElement: this.props.parentElement,
            targetBox: bounds,
            text: "Show more remix controls",
          }),
        }),
      })
    );

    button.element.innerHTML = createToggleSwitchSvg();

    this.cancelOnDeactivate(Pointer.instance.addTarget(button.element));

    this.cancelOnDeactivate(
      Pointer.instance.didClick.subscribe((e) => {
        if (e.isHandled) {
          return;
        }

        if (e.target === button.element) {
          e.isHandled = true;
          this.onClick();
        }
      })
    );

    this.cancelOnDeactivate(
      Koji.instance.mode.didChange.subscribe((mode) => {
        switch (mode) {
          case "view":
            shouldShowCallout.setValue(false);
            button.setModifier("isVisible", false);
            break;
          case "template":
            shouldShowCallout.setValue(true);
            button.setModifier("isVisible", true);
            button.setModifier("isActive", false);
            button.element.title = "Change to edit mode";
            break;
          case "generator":
            shouldShowCallout.setValue(false);
            button.setModifier("isVisible", true);
            button.setModifier("isActive", true);
            button.element.title = "Change to remix mode";
            break;
        }
      }, true)
    );
  }

  private onClick(): void {
    const mode = Koji.instance.mode;
    switch (mode.value) {
      case "generator":
        mode.setValue("template");
        break;
      case "template":
        mode.setValue("generator");
        break;
      default:
        mode.setValue("generator");
        break;
    }
  }
}

const ButtonStyle = ElementStyle.givenDefinition({
  css: `
    appearance: none;
    background: transparent;
    border: none;
    box-sizing: border-box;
    left: 16px;
    bottom: 16px;
    outline: none;
    opacity: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    transition: 0.3s ease opacity;
    z-index: 1000;

    svg {
      .shadow {
        transition: 0.3s ease opacity;
      }
      
      .ellipse {
        transition: 0.3s ease cx;
      }

      .rect {
        transition: 0.3s ease stroke, 0.3s ease fill;
      }
    }
  `,
  modifiers: {
    isVisible: `
      pointer-events: auto;
      opacity: 1;
    `,
    isActive: `
      svg {
        .shadow {
          opacity: 0;
        }
        
        .ellipse {
          cx: 32.5px;
        }

        .rect {
          stroke: transparent;
          fill: #007aff;
        }
      }
    `,
  },
});
