import { Actor, MultiBinding } from "skytree";
import {
  Observable,
  ObservableArray,
  ObservableBase,
  ReadOnlyObservable,
  Receipt,
} from "@anderjason/observable";
import { ElementSizeWatcher, ElementStyle, ScrollArea } from "@anderjason/web";
import { headerAreaHeight, totalVerticalPadding } from "..";
import { Color } from "@anderjason/color";

export interface CardLayoutProps {
  layouts: ObservableArray<CardLayout>;
  parentElement: HTMLElement;
  maxHeight: ObservableBase<number>;

  title?: string;
  anchorBottom?: boolean;
}

export class CardLayout extends Actor<CardLayoutProps> {
  readonly listOrder = Observable.ofEmpty<number>();

  protected _cardHeight = Observable.ofEmpty<number>(Observable.isStrictEqual);
  readonly cardHeight = ReadOnlyObservable.givenObservable(this._cardHeight);

  private _element: HTMLDivElement;

  get element(): HTMLDivElement {
    return this._element;
  }

  onActivate() {
    this.props.layouts.addValue(this);
    this.listOrder.setValue(this.props.layouts.toIndexOfValue(this));

    this.cancelOnDeactivate(
      new Receipt(() => {
        this.props.layouts.removeValue(this);
      })
    );

    const wrapper = this.addActor(
      WrapperStyle.toManagedElement({
        tagName: "div",
        parentElement: this.props.parentElement,
      })
    );

    const scrollArea = this.addActor(
      new ScrollArea({
        parentElement: wrapper.element,
        scrollPositionColor: Color.givenHexString("#888888"),
        direction: "vertical",
        anchorBottom: this.props.anchorBottom
      })
    );

    const content = this.addActor(
      ContentStyle.toManagedElement({
        tagName: "div",
        parentElement: scrollArea.element,
      })
    );

    this._element = content.element;

    const measure = this.addActor(
      new ElementSizeWatcher({
        element: this._element,
      })
    );

    const heightBinding = this.addActor(
      MultiBinding.givenAnyChange([
        measure.output,
        this.listOrder,
        this.props.maxHeight,
      ])
    );

    this.cancelOnDeactivate(
      heightBinding.didInvalidate.subscribe(() => {
        const size = measure.output.value;
        const listOrder = this.listOrder.value;
        const maxHeight = this.props.maxHeight.value;

        if (size == null || size.height == 0) {
          return;
        }
        
        const requestedContentHeight = size.height + totalVerticalPadding;

        let marginTop = listOrder === 0 ? 0 : headerAreaHeight;

        wrapper.style.marginTop = `${marginTop}px`;

        let actualContentHeight: number;
        if (maxHeight != null) {
          const maxContentHeight = maxHeight - marginTop;
          actualContentHeight = Math.min(
            maxContentHeight,
            requestedContentHeight
          );
        } else {
          actualContentHeight = requestedContentHeight;
        }

        this._cardHeight.setValue(marginTop + actualContentHeight);
        wrapper.style.height = `${actualContentHeight}px`;

        wrapper.style.transform = `translateX(${listOrder * 100}%)`;
      }, true)
    );
  }
}

const WrapperStyle = ElementStyle.givenDefinition({
  css: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  `,
});

const ContentStyle = ElementStyle.givenDefinition({
  css: `
    background: #FFF;
    padding: 20px;
    box-sizing: border-box;
    color: #000;
  `,
});
