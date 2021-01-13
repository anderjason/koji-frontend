import { Observable, Receipt } from "@anderjason/observable";
import { ElementStyle, ManagedElement } from "@anderjason/web";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";

export interface ToggleButtonProps {
  target: ThisOrParentElement<HTMLButtonElement>;
  isActive: Observable<boolean>;
}

const switchSvg = `
  <svg width="59" height="36" viewBox="0 0 47 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect
        class="rect"
        x="3"
        y="3.5"
        width="41"
        height="22"
        rx="11"
        fill="transparent"
      />
      <ellipse class="ellipse" cx="14.5" cy="14.5" rx="9.5" ry="9" fill="#fff" />
    </g>
  </svg>
`;

export class ToggleButton extends Actor<ToggleButtonProps> {
  onActivate() {
    let button: HTMLButtonElement;

    switch (this.props.target.type) {
      case "thisElement":
        button = this.props.target.element;
        break;
      case "parentElement":
        button = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "button",
            parentElement: this.props.target.parentElement,
          })
        ).element;
        break;
      default:
        throw new Error("An element is required (this or parent)");
    }

    button.type = "button";
    button.innerHTML = switchSvg;
    button.addEventListener("click", this.onClick);

    this.cancelOnDeactivate(
      new Receipt(() => {
        button.removeEventListener("click", this.onClick);
      })
    );

    this.cancelOnDeactivate(
      this.props.isActive.didChange.subscribe((isActive) => {
        if (isActive == true) {
          button.className = ButtonStyle.toCombinedClassName("isActive");
        } else {
          button.className = ButtonStyle.toCombinedClassName();
        }
      }, true)
    );
  }

  private onClick(e: any): void {
    e?.stopPropagation();
    
    this.props.isActive.setValue(!this.props.isActive.value);
  }
}

const ButtonStyle = ElementStyle.givenDefinition({
  elementDescription: "Button",
  css: `
    appearance: none;
    background: transparent;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 36px;
    outline: none;
    opacity: 1;
    padding: 0;
    pointer-events: auto;
    transition: 0.3s ease opacity;
    -webkit-tap-highlight-color: transparent;

    svg {    
      margin-left: -4px;
      margin-right: -4px;

      .ellipse {
        transition: 0.3s ease cx;
      }

      .rect {
        transition: 0.3s ease fill;
        fill: rgb(235, 235, 235);
      }
    }
  `,
  modifiers: {
    isActive: `
      svg {
        .ellipse {
          cx: 32.5px;
        }

        .rect {
          fill: #007aff;
        }
      }
    `,
  },
});
