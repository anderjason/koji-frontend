import { PathPart } from "@anderjason/util/dist/ValuePath";

declare module "@withkoji/vcc" {
  export namespace Koji {
    const config: Config;
  }

  export interface EditorAttributes {
    type: "full" | "instant";
    mode: "new" | "edit";
  }

  export class InstantRemixing {
    constructor();
    get(path: PathPart[]): any;
    onSetValue(path: PathPart[], newValue: any, skipUpdate: boolean): void;
    onValueChanged(fn: (path: PathPart[], newValue: any) => void): void;

    onSetRemixing(
      fn: (isRemixing: boolean, editorAttributes: EditorAttributes) => void
    ): void;

    onSetActivePath(fn: (activePath: PathPart[] | null) => void): void;
    ready(): void;
    addVisibilityListener(fn: (isVisible: boolean) => void): void;

    remixingActivePath: string[] | null;
    isRemixing: boolean;
    onPresentControl(
      path: PathPart[],
      attributes: { [index: string]: any }
    ): void;
  }

  export class FeedSdk {
    constructor();
    load(): void;
    requestCancelTouch(): void;
    onPlaybackStateChanged(fn: (isPlaying: boolean) => void): void;
    navigate(url: string): void;
    present(url: string): void;
  }

  export class Keystore {
    constructor(projectId?: string, projectToken?: string);
    resolveValue(keyPath: string): Promise<string>;
  }
}
