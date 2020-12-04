import {
  Observable,
  ReadOnlyObservable,
  TypedEvent,
} from "@anderjason/observable";
import { Debounce, Duration } from "@anderjason/time";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { LocationUtil, ObservableState } from "@anderjason/web";
import { Actor } from "skytree";

type PathPart = string | number;

export type KojiSessionType =
  | "about"
  | "admin"
  | "edit"
  | "remix"
  | "screenshot"
  | "view";

export class KojiTools extends Actor<void> {
  private static _instance: KojiTools;

  static get instance(): KojiTools {
    if (KojiTools._instance == null) {
      KojiTools._instance = new KojiTools();
      KojiTools._instance.activate();
    }

    return KojiTools._instance;
  }

  private _isRemixingNow = Observable.ofEmpty<boolean>(
    Observable.isStrictEqual
  );
  private _sessionType = Observable.ofEmpty<KojiSessionType>(
    Observable.isStrictEqual
  );
  private _vccData: ObservableState;
  private _selectedPath = Observable.ofEmpty<ValuePath>(ValuePath.isEqual);
  private _instantRemixing: InstantRemixing;
  private _feedSdk: FeedSdk;
  private _updateKojiLater: Debounce<void>;

  readonly willReceiveExternalData = new TypedEvent<ValuePath>();
  readonly allPlaybackShouldStop = new TypedEvent();

  readonly isRemixingNow = ReadOnlyObservable.givenObservable(
    this._isRemixingNow
  );
  readonly sessionType = ReadOnlyObservable.givenObservable(this._sessionType);

  private constructor() {
    super();

    if (typeof window !== "undefined") {
      this._instantRemixing = new InstantRemixing();
      this._feedSdk = new FeedSdk();

      const query = LocationUtil.objectOfCurrentQueryString();
      if (query["koji-screenshot"] == "1") {
        this._sessionType.setValue("screenshot");
      } else if (query["context"] === "about") {
        this._sessionType.setValue("about");
      } else if (query["context"] === "admin") {
        this._sessionType.setValue("admin");
      } else {
        this._sessionType.setValue("view");
      }
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
        if (this._sessionType.value === "view") {
          if (editorAttributes?.mode === "edit") {
            this._sessionType.setValue("edit");
          } else if (editorAttributes?.mode === "new") {
            this._sessionType.setValue("remix");
          }
        }

        if (isRemixing === false) {
          this._selectedPath.setValue(undefined);
          this._isRemixingNow.setValue(false);
        } else {
          this._isRemixingNow.setValue(true);
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
