import { ExampleDefinition, ExamplesHome } from "@anderjason/example-tools";
import { ObservableArray } from "@anderjason/observable";
import { AlignBottomDemo } from "./AlignBottomDemo";
import { CalloutDemo } from "./CalloutDemo";
import { ConfirmationPromptDemo } from "./ConfirmationPromptDemo";
import { DisplayTextDemo } from "./DisplayTextDemo";
import { FloatLabelTextInputDemo } from "./FloatLabelTextInputDemo";
import { IntegerInputDemo } from "./IntegerInputDemo";
import { LoadingIndicatorDemo } from "./LoadingIndicatorDemo";
import { MoneyInputDemo } from "./MoneyInputDemo";
import { RemixModeButtonDemo } from "./RemixModeButtonDemo";
import { SubmitButtonDemo } from "./SubmitButtonDemo";
import { ThemeToolbarDemo } from "./ThemeToolbarDemo";

const definitions = ObservableArray.givenValues<ExampleDefinition>([
  {
    title: "Align bottom",
    actor: new AlignBottomDemo({}),
  },
  {
    title: "Confirmation prompt",
    actor: new ConfirmationPromptDemo({}),
  },
  {
    title: "Callout",
    actor: new CalloutDemo({}),
  },
  {
    title: "Display text",
    actor: new DisplayTextDemo({}),
  },
  {
    title: "Float label text input",
    actor: new FloatLabelTextInputDemo({}),
  },
  {
    title: "Submit button",
    actor: new SubmitButtonDemo({}),
  },
  {
    title: "Loading indicator",
    actor: new LoadingIndicatorDemo({}),
  },
  {
    title: "Money input",
    actor: new MoneyInputDemo({}),
  },
  {
    title: "Integer input",
    actor: new IntegerInputDemo({}),
  },
  {
    title: "Theme toolbar",
    actor: new ThemeToolbarDemo({}),
  },

  {
    title: "Remix mode button",
    actor: new RemixModeButtonDemo({}),
  },
]);

const main = new ExamplesHome({
  title: "koji-frontend-tools",
  definitions,
});
main.activate();
