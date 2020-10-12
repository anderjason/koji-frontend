import { Observable, Receipt, TypedEvent } from "@anderjason/observable";
import { Debounce, Duration } from "@anderjason/time";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { Actor } from "skytree";
import { ObservableState } from "../ObservableState";

export type KojiMode = "view" | "generator" | "template";
type PathPart = string | number;

export class Vcc extends Actor<void> {
  private static _instance: Vcc;

  static get instance(): Vcc {
    if (Vcc._instance == null) {
      Vcc._instance = new Vcc();
      Vcc._instance.activate();
    }

    return Vcc._instance;
  }

  readonly mode = Observable.givenValue<KojiMode>(
    "view",
    Observable.isStrictEqual
  );

  readonly willReceiveExternalData = new TypedEvent<ValuePath>();
  readonly allPlaybackShouldStop = new TypedEvent();

  private _observableState: ObservableState;
  private _selectedPath = Observable.ofEmpty<ValuePath>(ValuePath.isEqual);
  private _instantRemixing: InstantRemixing;
  private _feedSdk: FeedSdk;
  private _updateKojiLater: Debounce<void>;

  private constructor() {
    super();

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

  get observableState(): ObservableState {
    return this._observableState;
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

  onActivate() {
    this._observableState = this.addActor(
      new ObservableState({
        initialValue: this._instantRemixing?.get(["general"]),
      })
    );

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

      this._feedSdk.onPlaybackStateChanged((isPlaying) => {
        if (!isPlaying) {
          this.allPlaybackShouldStop.emit();
        }
      });
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

  subscribe(
    vccPath: ValuePath,
    fn: (value: any) => void,
    includeLast = false
  ): Receipt {
    return this._observableState.subscribe(vccPath, fn, includeLast);
  }

  toOptionalValueGivenPath(path: ValuePath): any {
    return this._observableState.toOptionalValueGivenPath(path);
  }

  update(path: ValuePath, newValue: any, immediate = false): void {
    this._observableState.update(path, newValue);

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
        this._observableState.toOptionalValueGivenPath(
          ValuePath.givenParts([])
        ),
        true
      );
    }
  }

  private onValueChanged = (path: PathPart[], newValue: any): void => {
    const valuePath = ValuePath.givenParts(path.slice(1));

    this.willReceiveExternalData.emit(valuePath);

    this._observableState.update(valuePath, newValue);
  };
}
