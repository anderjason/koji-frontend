import { ExampleDefinition, ExamplesHome } from "@anderjason/example-tools";
import { ObservableArray } from "@anderjason/observable";
import { AlignBottomDemo } from "./AlignBottomDemo";
import { CalloutDemo } from "./CalloutDemo";
import { CardDemo } from "./CardDemo";
import { CardVisibilityDemo } from "./CardVisibilityDemo";
import { ConfirmationPromptDemo } from "./ConfirmationPromptDemo";
import { DisplayTextDemo } from "./DisplayTextDemo";
import { EditableTextDemo } from "./EditableTextDemo";
import { FloatLabelTextareaDemo } from "./FloatLabelTextareaDemo";
import { FloatLabelTextInputDemo } from "./FloatLabelTextInputDemo";
import { IntegerInputDemo } from "./IntegerInputDemo";
import { LoadingIndicatorDemo } from "./LoadingIndicatorDemo";
import { MoneyInputDemo } from "./MoneyInputDemo";
import { OptionsSummaryDemo } from "./OptionsSummaryDemo";
import { PublishButtonDemo } from "./PublishButtonDemo";
import { RemixModeButtonDemo } from "./RemixModeButtonDemo";
import { SubmitButtonDemo } from "./SubmitButtonDemo";
import { ThemeToolbarDemo } from "./ThemeToolbarDemo";
import { ToggleButtonDemo } from "./ToggleButtonDemo";

const definitions = ObservableArray.givenValues<ExampleDefinition>([
  // {
  //   title: "Align bottom",
  //   actor: new AlignBottomDemo(),
  // },
  // {
  //   title: "Callout",
  //   actor: new CalloutDemo(),
  // },
  // {
  //   title: "Card",
  //   actor: new CardDemo(),
  // },
  // {
  //   title: "Card visibility",
  //   actor: new CardVisibilityDemo(),
  // },
  // {
  //   title: "Confirmation prompt",
  //   actor: new ConfirmationPromptDemo(),
  // },
  // {
  //   title: "Display text",
  //   actor: new DisplayTextDemo(),
  // },
  // {
  //   title: "Editable text",
  //   actor: new EditableTextDemo(),
  // },
  // {
  //   title: "Float label textarea",
  //   actor: new FloatLabelTextareaDemo(),
  // },
  // {
  //   title: "Float label text input",
  //   actor: new FloatLabelTextInputDemo(),
  // },
  // {
  //   title: "Integer input",
  //   actor: new IntegerInputDemo(),
  // },
  // {
  //   title: "Loading indicator",
  //   actor: new LoadingIndicatorDemo(),
  // },
  // {
  //   title: "Money input",
  //   actor: new MoneyInputDemo(),
  // },
  {
    title: "Options summary",
    actor: new OptionsSummaryDemo(),
  },
  // {
  //   title: "Publish button",
  //   actor: new PublishButtonDemo(),
  // },
  // {
  //   title: "Remix mode button",
  //   actor: new RemixModeButtonDemo(),
  // },
  // {
  //   title: "Submit button",
  //   actor: new SubmitButtonDemo(),
  // },
  // {
  //   title: "Theme toolbar",
  //   actor: new ThemeToolbarDemo(),
  // },
  {
    title: "Toggle button",
    actor: new ToggleButtonDemo(),
  },
]);

const main = new ExamplesHome({
  title: "koji-frontend-tools",
  definitions,
});
main.activate();


