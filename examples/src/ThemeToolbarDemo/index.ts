import { DemoActor } from "@anderjason/example-tools";
import { ElementStyle } from "@anderjason/web";
import { ThemeToolbar } from "../../../src/ThemeToolbar";

export class ThemeToolbarDemo extends DemoActor<void> {
  onActivate() {
    const themeToolbar = this.addActor(
      new ThemeToolbar({
        parentElement: this.parentElement,
      })
    );

    const backgroundExample = this.addActor(
      BackgroundExampleStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );

    const textExample = this.addActor(
      TextExampleStyle.toManagedElement({
        tagName: "div",
        parentElement: this.parentElement,
      })
    );
    textExample.element.innerHTML = "Example text";

    this.cancelOnDeactivate(
      themeToolbar.output.didChange.subscribe((theme) => {
        if (theme == null) {
          return;
        }

        theme.applyBackgroundStyle(backgroundExample.element);
        theme.applyTextStyle(textExample.element);
      }, true)
    );
  }
}

const BackgroundExampleStyle = ElementStyle.givenDefinition({
  css: `
    position: absolute;
    left: 20px;
    width: 150px;
    bottom: 20px;
    height: 45px;
    border-radius: 3px;
  `,
});

const TextExampleStyle = ElementStyle.givenDefinition({
  css: `
    position: absolute;
    right: 30px;
    bottom: 20px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
  `,
});
