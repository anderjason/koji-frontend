import { Observable } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";

export interface ToggleButtonProps {
  parentElement: HTMLElement;
  output: Observable<boolean>;
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
    const button = this.addActor(
      ButtonStyle.toManagedElement({
        tagName: "button",
        parentElement: this.props.parentElement,
      })
    );

    button.element.type = "button";
    button.element.innerHTML = switchSvg;

    this.cancelOnDeactivate(
      button.addManagedEventListener("click", (e) => {
        e.stopPropagation();
        
        this.onClick();
      })
    );

    this.cancelOnDeactivate(
      this.props.output.didChange.subscribe((isActive) => {
        button.setModifier("isActive", isActive == true);
      }, true)
    );
  }

  private onClick(): void {
    this.props.output.setValue(!this.props.output.value);
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
