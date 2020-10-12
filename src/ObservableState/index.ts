import { Observable, Receipt } from "@anderjason/observable";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { UndoContext } from "@anderjason/web";
import { Actor, PathBinding } from "skytree";

export interface ObservableStateProps {
  initialValue?: any;
}

export class ObservableState extends Actor<ObservableStateProps> {
  private _internalData = Observable.ofEmpty<unknown>(Observable.isStrictEqual);
  private _undoContext: UndoContext;
  private _pathBindings = new Set<PathBinding<unknown, unknown>>();

  onActivate() {
    this._undoContext = new UndoContext<unknown>(
      this.props.initialValue || {},
      10
    );

    this.cancelOnDeactivate(
      this._undoContext.currentStep.didChange.subscribe((undoStep) => {
        this._internalData.setValue(undoStep);
      }, true)
    );
  }

  get undoContext(): UndoContext {
    return this._undoContext;
  }

  subscribe(
    valuePath: ValuePath,
    fn: (value: any) => void,
    includeLast = false
  ): Receipt {
    const binding = this.addActor(
      new PathBinding({
        input: this._internalData,
        path: valuePath,
      })
    );

    this._pathBindings.add(binding);

    const innerHandle = this.cancelOnDeactivate(
      binding.output.didChange.subscribe((value) => {
        fn(value);
      }, includeLast)
    );

    return new Receipt(() => {
      this._pathBindings.delete(binding);

      innerHandle.cancel();
      this.removeCancelOnDeactivate(innerHandle);
      this.removeActor(binding);
    });
  }

  toOptionalValueGivenPath(path: ValuePath): any {
    return ObjectUtil.optionalValueAtPathGivenObject(
      this._internalData.value,
      path
    );
  }

  update(path: ValuePath, newValue: any): void {
    const obj = ObjectUtil.objectWithValueAtPath(
      this._internalData.value,
      path,
      newValue
    );
    this._internalData.setValue(obj);
  }
}
