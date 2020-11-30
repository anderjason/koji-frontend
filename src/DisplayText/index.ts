import { Observable } from "@anderjason/observable";
import { ElementStyle } from "@anderjason/web";
import { Actor } from "skytree";
import { KojiAppearance, KojiTheme } from "../KojiAppearance";
import { Description } from "./_internal/Description";

export type DisplayTextType = "title" | "description";

export interface DisplayTextProps {
  parentElement: HTMLElement;
  displayType: DisplayTextType;
  text: string | Observable<string>;

  theme?: KojiTheme | Observable<KojiTheme>;
}

export class DisplayText extends Actor<DisplayTextProps> {
  constructor(props: DisplayTextProps) {
    super(props);

    KojiAppearance.preloadFonts();
  }

  onActivate() {
    const observableText = Observable.givenValueOrObservable(this.props.text);
    const observableTheme = Observable.givenValueOrObservable(
      this.props.theme || KojiAppearance.themes.get("kojiBlack")
    );

    if (styleByDisplayType.has(this.props.displayType)) {
      const style = styleByDisplayType.get(this.props.displayType);

      const div = this.addActor(
        style.toManagedElement({
          tagName: "div",
          parentElement: this.props.parentElement,
        })
      );
      div.element.classList.add("kft-text");

      this.cancelOnDeactivate(
        observableText.didChange.subscribe((text) => {
          div.element.innerHTML = text || "";
        }, true)
      );

      this.cancelOnDeactivate(
        observableTheme.didChange.subscribe((theme) => {
          if (theme == null) {
            return;
          }

          if (this.props.displayType === "title") {
            theme.applyTextStyle(div.element);
          }
        }, true)
      );

      return;
    }

    if (this.props.displayType === "description") {
      this.addActor(
        new Description({
          parentElement: this.props.parentElement,
          text: observableText,
        })
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
    margin-top: -4px;
    text-align: left;
    user-select: none;
  `,
});

const styleByDisplayType = new Map<DisplayTextType, ElementStyle>();
styleByDisplayType.set("title", TitleStyle);
