import {
  Observable,
  ReadOnlyObservable,
  TypedEvent,
} from "@anderjason/observable";
import { Debounce, Duration } from "@anderjason/time";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { ObservableState } from "@anderjason/web";
import { Actor } from "skytree";
import { EditorAttributes } from "@withkoji/vcc";

type PathPart = string | number;

export class Koji extends Actor<void> {
  private static _instance: Koji;

  static get instance(): Koji {
    if (Koji._instance == null) {
      Koji._instance = new Koji();
      Koji._instance.activate();
    }

    return Koji._instance;
  }

  private _isRemixing = Observable.ofEmpty<boolean>(Observable.isStrictEqual);
  private _editorAttributes = Observable.ofEmpty<EditorAttributes>();
  private _vccData: ObservableState;
  private _selectedPath = Observable.ofEmpty<ValuePath>(ValuePath.isEqual);
  private _instantRemixing: InstantRemixing;
  private _feedSdk: FeedSdk;
  private _updateKojiLater: Debounce<void>;

  readonly willReceiveExternalData = new TypedEvent<ValuePath>();
  readonly allPlaybackShouldStop = new TypedEvent();

  readonly isRemixing = ReadOnlyObservable.givenObservable(this._isRemixing);
  readonly editorAttributes = ReadOnlyObservable.givenObservable(
    this._editorAttributes
  );

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

  get vccData(): ObservableState {
    return this._vccData;
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
    this._vccData = this.addActor(
      new ObservableState({
        initialState: this._instantRemixing?.get(["general"]),
      })
    );

    this.cancelOnDeactivate(
      this._vccData.state.didChange.subscribe(() => {
        this._updateKojiLater.invoke();
      })
    );

    if (this._instantRemixing != null) {
      this._instantRemixing.onValueChanged((path, newValue) => {
        this.onValueChanged(path, newValue);
      });

      this._instantRemixing.onSetRemixing((isRemixing, editorAttributes) => {
        if (isRemixing === false) {
          this._editorAttributes.setValue(undefined);

          this._selectedPath.setValue(undefined);
          this._isRemixing.setValue(false);
        } else {
          this._editorAttributes.setValue(editorAttributes);
          this._isRemixing.setValue(true);
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

        (this._instantRemixing as any).onPresentControl(
          externalPath.toParts(),
          { preventNavigation: true }
        );
      } else {
        (this._instantRemixing as any).onPresentControl(undefined);
      }
    });
  }

  sendPendingUpdates() {
    this._updateKojiLater.clear();

    if (this._instantRemixing != null) {
      const currentValue = this._instantRemixing.get(["general"]);
      if (
        ObjectUtil.objectIsDeepEqual(currentValue, this._vccData.state.value)
      ) {
        return; // nothing to update
      }

      (this._instantRemixing as any).onSetValue(
        ["general"],
        ObjectUtil.objectWithDeepMerge({}, this._vccData.state.value), // make sure to pass a clone to instant remixing
        true
      );
    }
  }

  private onValueChanged = (path: PathPart[], newValue: any): void => {
    const valuePath = ValuePath.givenParts(path.slice(1));

    this.willReceiveExternalData.emit(valuePath);

    this._vccData.update(valuePath, newValue);
  };
}
