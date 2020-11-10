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
    get(path: string[]): any;
    onSetValue(fn: (path: string[], newValue: any) => void): void;
    onValueChanged(fn: (path: string[], newValue: any) => void): void;

    onSetRemixing(
      fn: (isRemixing: boolean, editorAttributes: EditorAttributes) => void
    ): void;

    onSetActivePath(fn: (activePath: string[] | null) => void): void;
    ready(): void;
    addVisibilityListener(fn: (isVisible: boolean) => void): void;

    remixingActivePath: string[] | null;
    isRemixing: boolean;
    onPresentControl(
      path: string[],
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
