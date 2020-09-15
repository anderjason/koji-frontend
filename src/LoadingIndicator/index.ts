import { ManagedObject, Timer } from "skytree";
import { Duration } from "@anderjason/time";
import { Color } from "@anderjason/color";
import { ElementStyle } from "@anderjason/web";

export interface LoadingIndicatorProps {
  parentElement: HTMLElement;
  waitDuration?: Duration;
  color?: Color;
}

export class LoadingIndicator extends ManagedObject<LoadingIndicatorProps> {
  onActivate() {
    const managedLoader = this.addManagedObject(
      LoaderStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    if (this.props.parentElement === document.body) {
      managedLoader.addModifier("isCentered");
    }

    const color = this.props.color || Color.givenHexString("#FFFFFF");
    const hexColor = color.toHexString();

    managedLoader.element.innerHTML = `
      <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                <stop stop-color="${hexColor}" stop-opacity="0" offset="0%"/>
                <stop stop-color="${hexColor}" stop-opacity=".631" offset="63.146%"/>
                <stop stop-color="${hexColor}" offset="100%"/>
            </linearGradient>
        </defs>
        <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)">
                <path d="M36 18c0-9.94-8.06-18-18-18" stroke="url(#a)" stroke-width="2" />
                <circle fill="${hexColor}" cx="36" cy="18" r="1" />
            </g>
        </g>
      </svg>
    `;

    this.addManagedObject(
      new Timer({
        fn: () => {
          managedLoader.style.opacity = "1";
        },
        duration: this.props.waitDuration || Duration.givenSeconds(0.5),
      })
    );
  }
}

export const LoaderStyle = ElementStyle.givenDefinition({
  css: `
    animation: spin 1s linear infinite;
    height: 40px;
    opacity: 0;
    pointer-events: none;
    transition: 1s ease opacity;
    user-select: none;
    width: 40px;

    @keyframes spin { 
      100% { 
        transform: rotate(360deg);
      }
    }
  `,
  modifiers: {
    isCentered: `
      left: 50%;
      margin: -20px 0 0 -20px;
      position: absolute;
      top: 50%;
      z-index: 2000;
    `,
  },
});
