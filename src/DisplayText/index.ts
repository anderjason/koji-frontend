import { Color } from "@anderjason/color";
import { Observable } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { KojiAppearance } from "../KojiAppearance";

export type DisplayTextType = "title";

export interface DisplayTextProps {
  parentElement: HTMLElement;
  displayType: DisplayTextType;
  text: string | Observable<string>;

  color?: Color | Observable<Color>;
}

export class DisplayText extends Actor<DisplayTextProps> {
  constructor(props: DisplayTextProps) {
    super(props);

    KojiAppearance.preloadFonts();
  }

  onActivate() {
    const style = styleByDisplayType.get(this.props.displayType);
    if (style == null) {
      return;
    }

    const actor = this.addActor(
      style.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    const observableText = Observable.givenValueOrObservable(this.props.text);

    this.cancelOnDeactivate(
      observableText.didChange.subscribe((text) => {
        actor.element.innerHTML = text || "";
      }, true)
    );

    if (this.props.color != null) {
      const observableColor = Observable.givenValueOrObservable(
        this.props.color
      );

      this.cancelOnDeactivate(
        observableColor.didChange.subscribe((color) => {
          if (color == null) {
            return;
          }

          actor.style.color = color.toHexString();
        }, true)
      );
    }
  }
}

const TitleStyle = ElementStyle.givenDefinition({
  elementDescription: "Title",
  css: `
    border: none;
    color: #2D2F30;
    font-family: PT Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 34px;
    letter-spacing: 0.02em;
    user-select: none;
  `,
});

const styleByDisplayType = new Map<DisplayTextType, ElementStyle>();
styleByDisplayType.set("title", TitleStyle);
