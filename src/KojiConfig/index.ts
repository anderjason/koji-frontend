import {
  Observable,
  ReadOnlyObservable,
  Receipt,
  TypedEvent,
} from "@anderjason/observable";
import { Debounce, Duration } from "@anderjason/time";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { UndoManager } from "@anderjason/web";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ManagedObject, PathBinding } from "skytree";

export type KojiMode = "view" | "generator" | "template";
type PathPart = string | number;

export class KojiConfig extends ManagedObject {
  private static _instance: KojiConfig;

  static get instance(): KojiConfig {
    if (KojiConfig._instance == null) {
      KojiConfig._instance = new KojiConfig();
      KojiConfig._instance.activate();
    }

    return KojiConfig._instance;
  }

  readonly mode = Observable.givenValue<KojiMode>(
    "view",
    Observable.isStrictEqual
  );

  readonly willReceiveExternalData = new TypedEvent<ValuePath>();

  private _internalData = Observable.ofEmpty<unknown>(Observable.isStrictEqual);
  private _undoManager: UndoManager;
  private _selectedPath = Observable.ofEmpty<ValuePath>(ValuePath.isEqual);
  private _instantRemixing: InstantRemixing;
  private _feedSdk: FeedSdk;
  private _updateKojiLater: Debounce<void>;
  private _pathBindings = new Set<PathBinding>();

  private constructor() {
    super({});

    if (typeof window !== "undefined") {
      this._instantRemixing = new InstantRemixing();
      this._feedSdk = new FeedSdk();
    }

    this._updateKojiLater = new Debounce({
      fn: () => {
        this.sendPendingUpdates();
      },
      duration: Duration.givenSeconds(0.25),
    });
  }

  get selectedPath(): Observable<ValuePath> {
    return this._selectedPath;
  }

  get instantRemixing(): InstantRemixing {
    return this._instantRemixing;
  }

  get feedSdk(): FeedSdk {
    return this._feedSdk;
  }

  get canUndo(): ReadOnlyObservable<boolean> {
    return this._undoManager.canUndo;
  }

  get canRedo(): ReadOnlyObservable<boolean> {
    return this._undoManager.canRedo;
  }

  onActivate() {
    this._undoManager = new UndoManager<unknown>(
      this._instantRemixing?.get(["general"]) || {},
      10
    );

    this._undoManager.currentStep.didChange.subscribe((undoStep) => {
      this._internalData.setValue(undoStep);
    }, true);

    if (this._instantRemixing != null) {
      this._instantRemixing.onValueChanged((path, newValue) => {
        this.onValueChanged(path, newValue);
      });

      let previousEditMode: KojiMode = undefined;

      this._instantRemixing.onSetRemixing((isRemixing) => {
        if (isRemixing === false) {
          if (this.mode.value !== "view") {
            previousEditMode = this.mode.value;
          }

          this._selectedPath.setValue(undefined);
          this.mode.setValue("view");
        } else {
          this.mode.setValue(previousEditMode || "template");
        }
      });

      this._instantRemixing.onSetActivePath((externalPath) => {
        if (externalPath == null) {
          this._selectedPath.setValue(undefined);
        } else {
          const internalPath = externalPath.slice(1);
          this._selectedPath.setValue(ValuePath.givenParts(internalPath));
        }
      });

      this._instantRemixing.ready();
    }

    if (this._feedSdk != null) {
      this._feedSdk.load();
    }

    this._selectedPath.didChange.subscribe((path) => {
      if (path != null) {
        const externalPath = ValuePath.givenParts([
          "general",
          ...path.toParts(),
        ]);

        (this._instantRemixing as any).onPresentControl(externalPath.toParts());
      } else {
        (this._instantRemixing as any).onPresentControl(undefined);
      }
    });
  }

  createUndoStep(): void {
    this._undoManager.addStep(this._internalData.value);
  }

  clearUndoSteps(): void {
    this._undoManager.clearSteps();
  }

  undo(): void {
    if (this._undoManager.undo()) {
      this._updateKojiLater.invoke();
    }
  }

  redo(): void {
    if (this._undoManager.redo()) {
      this._updateKojiLater.invoke();
    }
  }

  subscribe(
    vccPath: ValuePath,
    fn: (value: any) => void,
    includeLast = false
  ): Receipt {
    const binding = this.addManagedObject(
      new PathBinding({
        input: this._internalData,
        path: vccPath,
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
      this.removeManagedObject(binding);
    });
  }

  toOptionalValueGivenPath(path: ValuePath): any {
    return ObjectUtil.optionalValueAtPathGivenObject(
      this._internalData.value,
      path
    );
  }

  update(path: ValuePath, newValue: any, immediate = false): void {
    const obj = ObjectUtil.objectWithValueAtPath(
      this._internalData.value,
      path,
      newValue
    );
    this._internalData.setValue(obj);

    if (immediate == true) {
      this.sendPendingUpdates();
    } else {
      this._updateKojiLater.invoke();
    }
  }

  sendPendingUpdates() {
    this._updateKojiLater.clear();

    if (this._instantRemixing != null) {
      (this._instantRemixing as any).onSetValue(
        ["general"],
        this._internalData.value,
        true
      );
    }
  }

  private onValueChanged = (path: PathPart[], newValue: any): void => {
    const valuePath = ValuePath.givenParts(path);

    this.willReceiveExternalData.emit(valuePath);

    const internalPath = path.slice(1);
    let internalData: any = this._internalData.value;

    if (internalPath.length === 0) {
      internalData = newValue;
    } else {
      internalData = ObjectUtil.objectWithValueAtPath(
        internalData,
        internalPath,
        newValue
      );
    }

    const newInternalData = {
      ...internalData,
    };

    this._internalData.setValue(newInternalData);
  };
}
