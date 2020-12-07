import {
  Observable,
  ObservableBase,
  ReadOnlyObservable,
  Receipt,
} from "@anderjason/observable";
import { Actor } from "skytree";
import { CardLayout } from "./CardLayout";

export interface CurrentLayoutHeightProps {
  layout: ObservableBase<CardLayout>;
}

export class CurrentLayoutHeight extends Actor<CurrentLayoutHeightProps> {
  private _output = Observable.ofEmpty<number>(Observable.isStrictEqual);
  readonly output = ReadOnlyObservable.givenObservable(this._output);

  onActivate() {
    let receipt: Receipt;

    this.cancelOnDeactivate(
      this.props.layout.didChange.subscribe((layout) => {
        if (receipt != null) {
          this.removeCancelOnDeactivate(receipt);
          receipt.cancel();
          receipt = undefined;
        }

        if (layout != null) {
          receipt = layout.cardHeight.didChange.subscribe((height) => {
            this._output.setValue(height);
          }, true);
        }
      })
    );
  }
}
