import {
  Observable,
  ReadOnlyObservable,
  TypedEvent,
} from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { FeedSdk, InstantRemixing } from "@withkoji/vcc";
import { LocationUtil, ObservableState, ScrollArea } from "@anderjason/web";
import { Actor } from "skytree";

type PathPart = string | number;

export type KojiMode =
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

    if (typeof window !== "undefined") {
      (window as any).koji = KojiTools._instance;
    }
    
    return KojiTools._instance;
  }

  private _currentMode = Observable.ofEmpty<KojiMode>(Observable.isStrictEqual);
  private _sessionMode = Observable.ofEmpty<KojiMode>(Observable.isStrictEqual);
  private _vccData: ObservableState;
  private _selectedPath = Observable.ofEmpty<ValuePath>(ValuePath.isEqual);
  private _instantRemixing: InstantRemixing;
  private _feedSdk: FeedSdk;

  readonly willReceiveExternalData = new TypedEvent<ValuePath>();
  readonly allPlaybackShouldStop = new TypedEvent();

  readonly currentMode = ReadOnlyObservable.givenObservable(this._currentMode);
  readonly sessionMode = ReadOnlyObservable.givenObservable(this._sessionMode);

  private constructor() {
    super();

    if (typeof window !== "undefined") {
      this._instantRemixing = new InstantRemixing();
      this._feedSdk = new FeedSdk();

      const query = LocationUtil.objectOfCurrentQueryString();
      if (query["koji-screenshot"] == "1") {
        this._sessionMode.setValue("screenshot");
        this._currentMode.setValue("screenshot");
      } else if (query["context"] === "about") {
        this._sessionMode.setValue("about");
        this._currentMode.setValue("about");
      } else if (query["context"] === "admin") {
        this._sessionMode.setValue("admin");
        this._currentMode.setValue("admin");
      } else {
        this._sessionMode.setValue("view");
        this._currentMode.setValue("view");
      }
    }
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
      this._vccData.willChange.subscribe(change => {
        if (this._instantRemixing == null) {
          return;
        }
      
        this._instantRemixing.onSetValue(
          change.valuePath.toParts(),
          change.newValue,
          true
        );
      })
    );

    if (this._instantRemixing != null) {
      this._instantRemixing.onValueChanged((path, newValue) => {
        this.onValueChanged(path, newValue);
      });

      this._instantRemixing.onSetRemixing((isRemixing, editorAttributes) => {
        const sessionMode = this._sessionMode.value;

        if (
          sessionMode === "about" ||
          sessionMode === "screenshot" ||
          sessionMode === "admin"
        ) {
          return;
        }

        if (editorAttributes?.mode === "edit") {
          this._sessionMode.setValue("edit");
        } else if (editorAttributes?.mode === "new") {
          this._sessionMode.setValue("remix");
        }

        if (isRemixing === false) {
          this._selectedPath.setValue(undefined);
          this._currentMode.setValue("view");
        } else {
          this._currentMode.setValue(this._sessionMode.value);
        }
      });

      this._instantRemixing.onSetActivePath((externalPath) => {
        if (externalPath == null) {
          this._selectedPath.setValue(undefined);
        } else {
          if (externalPath[0] !== "general") {
            return;
          }
          
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

      this.cancelOnDeactivate(ScrollArea.willScroll.subscribe(() => {
        this._feedSdk.requestCancelTouch();
      }));
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

  private onValueChanged = (path: PathPart[], newValue: any): void => {
    const valuePath = ValuePath.givenParts(path.slice(1));

    this.willReceiveExternalData.emit(valuePath);

    this._vccData.update(valuePath, newValue);
  };
}
