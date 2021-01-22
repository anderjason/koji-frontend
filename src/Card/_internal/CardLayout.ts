import { Actor, MultiBinding } from "skytree";
import {
  Observable,
  ObservableArray,
  ObservableBase,
  ReadOnlyObservable,
  Receipt,
} from "@anderjason/observable";
import { ElementSizeWatcher, ElementStyle, ScreenSize, ScrollArea } from "@anderjason/web";
import { headerAreaHeight } from "..";
import { Color } from "@anderjason/color";

export interface CardLayoutProps {
  layouts: ObservableArray<CardLayout>;
  parentElement: HTMLElement;
  maxHeight: ObservableBase<number>;
  
  title?: string | ObservableBase<string>;
  anchorBottom?: boolean | ObservableBase<boolean>;
  onRemoved?: () => void;
}

export class CardLayout extends Actor<CardLayoutProps> {
  readonly listOrder = Observable.ofEmpty<number>();

  protected _cardHeight = Observable.ofEmpty<number>(Observable.isStrictEqual);
  readonly cardHeight = ReadOnlyObservable.givenObservable(this._cardHeight);

  readonly title: ObservableBase<string>;

  private _contentElement: HTMLDivElement;
  private _footerElement: HTMLDivElement;

  get element(): HTMLDivElement {
    return this._contentElement;
  }

  get footerElement(): HTMLDivElement {
    return this._footerElement;
  }

  constructor(props: CardLayoutProps) {
    super(props);

    this.title = Observable.givenValueOrObservable(props.title);
  }

  onActivate() {
    this.props.layouts.addValue(this);
    this.listOrder.setValue(this.props.layouts.toIndexOfValue(this));

    this.cancelOnDeactivate(
      new Receipt(() => {
        this.props.layouts.removeValue(this);
      })
    );

    const cardLayoutWrapper = this.addActor(
      CardLayoutWrapper.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    const outsideScrollArea = this.addActor(
      OutsideScrollAreaStyle.toManagedElement({
        tagName: "div",
        parentElement: cardLayoutWrapper.element,
      })
    );

    
    const footer = this.addActor(
      FooterStyle.toManagedElement({
        tagName: "div",
        parentElement: cardLayoutWrapper.element
      })
    );

    const scrollArea = this.addActor(
      new ScrollArea({
        parentElement: outsideScrollArea.element,
        scrollPositionColor: Color.givenHexString("#888888"),
        direction: "vertical",
        anchorBottom: this.props.anchorBottom
      })
    );

    const insideScrollArea = this.addActor(
      InsideScrollAreaStyle.toManagedElement({
        tagName: "div",
        parentElement: scrollArea.element,
      })
    );

    this._contentElement = insideScrollArea.element;
    this._footerElement = footer.element;

    const measureFooter = this.addActor(
      new ElementSizeWatcher({
        element: footer.element,
      })
    );

    const measureInside = this.addActor(
      new ElementSizeWatcher({
        element: insideScrollArea.element,
      })
    );

    const heightBinding = this.addActor(
      MultiBinding.givenAnyChange([
        measureFooter.output,
        measureInside.output,
        this.listOrder,
        this.props.maxHeight,
        ScreenSize.instance.availableSize
      ])
    );

    this.cancelOnDeactivate(
      new Receipt(() => {
        if (this.props.onRemoved != null) {
          this.props.onRemoved();
        }
      })
    );

    this.cancelOnDeactivate(
      heightBinding.didInvalidate.subscribe(() => {
        const contentHeight = measureInside.output.value?.height || 0;
        const footerHeight = measureFooter.output.value?.height || 0;
        const listOrder = this.listOrder.value;
        const maxHeight = this.props.maxHeight.value;

        const requestedFooterHeight = footerHeight == 0 ? 0 : footerHeight + 15;  // footer vertical padding
        const requestedContentHeight = contentHeight == 0 ? 5 : contentHeight + 20;  // content vertical padding

        let marginTop = listOrder === 0 ? 0 : headerAreaHeight;

        cardLayoutWrapper.style.marginTop = `${marginTop + 10}px`;

        let visibleContentHeight: number;
        if (maxHeight != null) {
          const maxContentHeight = maxHeight - marginTop;
          visibleContentHeight = Math.min(
            maxContentHeight,
            requestedContentHeight
          );
        } else {
          // 100 pixels to leave room for the Koji button (in view mode), or the publish button (in remix mode)
          const availableHeight = ScreenSize.instance.availableSize.value.height - 100;
          const maxContentHeight = availableHeight - marginTop;

          visibleContentHeight = Math.min(
            maxContentHeight,
            requestedContentHeight
          );
        }

        this._cardHeight.setValue(marginTop + visibleContentHeight + requestedFooterHeight + 20);
        outsideScrollArea.style.height = `${visibleContentHeight}px`;
        cardLayoutWrapper.style.transform = `translateX(${listOrder * 100}%)`;
      }, true)
    );
  }
}

const CardLayoutWrapper = ElementStyle.givenDefinition({
  elementDescription: "CardLayoutWrapper",
  css: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    background: #FFF;
  `,
});

const OutsideScrollAreaStyle = ElementStyle.givenDefinition({
  elementDescription: "OutsideScrollArea",
  css: `
    position: relative;
    margin: 0;
    flex-shrink: 0;
  `,
});

const InsideScrollAreaStyle = ElementStyle.givenDefinition({
  elementDescription: "InsideScrollArea",
  css: `
    background: #FFF;
    padding: 10px 20px;
    box-sizing: border-box;
    color: #000;
  `,
});

const FooterStyle = ElementStyle.givenDefinition({
  elementDescription: "Footer",
  css: `
    padding: 5px 20px 10px 20px;
    box-sizing: border-box;
    flex-shrink: 0;
  `,
});
