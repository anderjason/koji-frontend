import { ExampleDefinition, ExamplesHome } from "@anderjason/example-tools";
import { ObservableArray } from "@anderjason/observable";
import { CalloutDemo } from "./CalloutDemo";
import { ConfirmationPromptDemo } from "./ConfirmationPromptDemo";
import { DescriptionDemo } from "./DescriptionDemo";
import { FloatLabelTextInputDemo } from "./FloatLabelTextInputDemo";
import { IntegerInputDemo } from "./IntegerInputDemo";
import { LoadingIndicatorDemo } from "./LoadingIndicatorDemo";
import { PriceInputDemo } from "./PriceInputDemo";
import { RemixModeButtonDemo } from "./RemixModeButtonDemo";
import { SubmitButtonDemo } from "./SubmitButtonDemo";
import { ThemeToolbarDemo } from "./ThemeToolbarDemo";

const definitions = ObservableArray.givenValues<ExampleDefinition>([
  {
    title: "Confirmation prompt",
    actor: new ConfirmationPromptDemo({}),
  },
  {
    title: "Callout",
    actor: new CalloutDemo({}),
  },
  {
    title: "Description",
    actor: new DescriptionDemo({}),
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
    title: "Price input",
    actor: new PriceInputDemo({}),
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
