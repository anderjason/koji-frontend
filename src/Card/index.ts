import {
  Observable,
  ObservableArray,
  ObservableBase,
} from "@anderjason/observable";
import { Debounce, Duration } from "@anderjason/time";
import { ArrayUtil } from "@anderjason/util";
import {
  DynamicStyleElement,
  ElementStyle,
  ManagedElement,
} from "@anderjason/web";
import { Actor } from "skytree";
import { ThisOrParentElement } from "..";
import { CardLayout } from "./_internal/CardLayout";
import { CurrentLayoutHeight } from "./_internal/CurrentLayoutHeight";

export interface CardProps {
  target: ThisOrParentElement<HTMLDivElement>;

  maxHeight?: number | ObservableBase<number>;
}

export interface AddPageOptions {
  title?: string;
}

export const headerAreaHeight = 40;
export const totalVerticalPadding = 40;
export const cardTransitionDuration = Duration.givenSeconds(0.5);
export const cardHeightAnimateDuration = Duration.givenSeconds(0.6);
export const cardTransitionEasing = "cubic-bezier(.52,.01,.28,1)";

const backIconSvg = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor" /></svg>`;

export class Card extends Actor<CardProps> {
  private _outer: HTMLDivElement;
  private _layouts = ObservableArray.ofEmpty<CardLayout>();
  private _slider: DynamicStyleElement<HTMLDivElement>;
  private _baseLayout: CardLayout;
  private _maxHeight: ObservableBase<number>;

  constructor(props: CardProps) {
    super(props);

    this._maxHeight = Observable.givenValueOrObservable(
      this.props.maxHeight || 500,
      Observable.isStrictEqual
    );
  }

  get baseElement(): HTMLElement {
    return this._baseLayout.element;
  }

  onActivate() {
    switch (this.props.target.type) {
      case "thisElement":
        this._outer = this.props.target.element;
        break;
      case "parentElement":
        this._outer = this.addActor(
          ManagedElement.givenDefinition({
            tagName: "div",
            parentElement: this.props.target.parentElement,
          })
        ).element;
        break;
      default:
        throw new Error("An element is required (this or parent)");
    }

    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this._outer,
      })
    );

    this._slider = this.addActor(
      SliderStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );

    const headerArea = this.addActor(
      HeaderAreaStyle.toManagedElement({
        tagName: "div",
        parentElement: wrapper.element,
      })
    );

    const backButton = this.addActor(
      BackButtonStyle.toManagedElement({
        tagName: "button",
        parentElement: headerArea.element,
      })
    );
    const backIcon = document.createElement("svg");
    backButton.element.appendChild(backIcon);
    backIcon.outerHTML = backIconSvg;

    const backLabel = document.createElement("span");
    backLabel.innerHTML = "Back";
    backButton.element.appendChild(backLabel);

    const disableSliderAnimationLater = new Debounce({
      duration: cardHeightAnimateDuration,
      fn: () => {
        this._slider.setModifier("isAnimated", false);
      },
    });

    this.cancelOnDeactivate(
      backButton.addManagedEventListener("click", () => {
        const layout = selectedLayout.value;
        if (layout == null || this._layouts.count < 2) {
          return;
        }

        layout.deactivate();
      })
    );

    const titleArea = this.addActor(
      TitleAreaStyle.toManagedElement({
        tagName: "div",
        parentElement: headerArea.element,
      })
    );
    const titleDiv = document.createElement("div");
    titleArea.element.appendChild(titleDiv);

    const selectedLayout = Observable.ofEmpty<CardLayout>(
      Observable.isStrictEqual
    );

    this.cancelOnDeactivate(
      selectedLayout.didChange.subscribe((layout, oldLayout) => {
        if (layout == null) {
          return;
        }

        if (oldLayout != null) {
          // animates height and left/right transition
          this._slider.setModifier("isAnimated", true);
          disableSliderAnimationLater.invoke();
        }

        const index = this._layouts.toIndexOfValue(layout);
        this._slider.style.transform = `translateX(${index * -100}%)`;

        if (index !== 0) {
          // leave the title as-is if changing back to the first card, so the text can transition out
          titleDiv.innerHTML = layout.props.title || "";
        }

        headerArea.setModifier("isVisible", index !== 0);
        backButton.setModifier("isVisible", index !== 0);
        titleArea.setModifier("isVisible", index !== 0);
      }, true)
    );

    const currentLayoutHeight = this.addActor(
      new CurrentLayoutHeight({
        layout: selectedLayout,
      })
    );

    this.cancelOnDeactivate(
      currentLayoutHeight.output.didChange.subscribe((height) => {
        if (height == null) {
          return;
        }

        this._slider.style.height = `${height}px`;
      }, true)
    );

    this.cancelOnDeactivate(
      this._layouts.didChange.subscribe((layouts) => {
        if (layouts == null) {
          return;
        }

        selectedLayout.setValue(ArrayUtil.optionalLastValueGivenArray(layouts));
      }, true)
    );

    this._baseLayout = this.addPage();
  }

  addPage(options: AddPageOptions = {}): CardLayout {
    return this.addActor(
      new CardLayout({
        title: options.title,
        layouts: this._layouts,
        parentElement: this._slider.element,
        maxHeight: this._maxHeight,
      })
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  elementDescription: "Wrapper",
  css: `
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    color: #2D2F30;
    margin: 20px;
    overflow: hidden;
    position: relative;
    width: calc(100% - 40px);
    
    .kft-text + .kft-control {
      margin-top: 11px;
    }

    .kft-control + .kft-control {
      margin-top: 15px;
    }
  `,
});

const SliderStyle = ElementStyle.givenDefinition({
  css: `
    height: 50px;    
  `,
  modifiers: {
    isAnimated: `
      transition: ${cardTransitionDuration.toSeconds()}s ${cardTransitionEasing} all;
    `,
  },
});

const HeaderAreaStyle = ElementStyle.givenDefinition({
  css: `
    background: #FFF;
    border-bottom: 1px solid #EEE;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    height: ${headerAreaHeight}px;
    left: 0;
    opacity: 0;
    position: absolute;
    pointer-events: none;
    right: 0;
    top: 0;
    transition: ${cardTransitionDuration.toSeconds()}s ${cardTransitionEasing} opacity;
  `,
  modifiers: {
    isVisible: `
      opacity: 1; 
      pointer-events: auto;
    `,
  },
});

const BackButtonStyle = ElementStyle.givenDefinition({
  css: `
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    color: #007AFF;
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0;
    outline: none;
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 0 20px;
    transform: translateX(100px);
    transition: ${cardTransitionDuration.toSeconds()}s ${cardTransitionEasing} transform;
    user-select: none;

    svg {
      height: 32px;
      margin: 1px -3px 0 -16px;
      width: 32px;
    }
  `,
  modifiers: {
    isVisible: `
      pointer-events: auto;
      transform: none;
    `,
  },
});

const TitleAreaStyle = ElementStyle.givenDefinition({
  css: `
    align-items: center;
    bottom: 0;
    display: flex;
    font-weight: bold;
    justify-content: center;
    left: 80px;
    pointer-events: none;
    position: absolute;
    right: 80px;
    top: 0;
    transform: translateX(200px);
    transition: ${cardTransitionDuration.toSeconds()}s ${cardTransitionEasing} transform;
    user-select: none;

    div {
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }
  `,
  modifiers: {
    isVisible: `
      transform: none;
    `,
  },
});
