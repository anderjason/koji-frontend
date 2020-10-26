import { ObservableArray } from "@anderjason/observable";
import { ExampleDefinition, ExamplesHome } from "@anderjason/example-tools";
import { CalloutDemo } from "./CalloutDemo";
import { DescriptionDemo } from "./DescriptionDemo";
import { FloatLabelTextInputDemo } from "./FloatLabelTextInputDemo";
import { LoadingIndicatorDemo } from "./LoadingIndicatorDemo";
import { PriceInputDemo } from "./PriceInputDemo";
import { ThemeToolbarDemo } from "./ThemeToolbarDemo";
import { RemixModeButtonDemo } from "./RemixModeButtonDemo";
import { ButtonDemo } from "./ButtonDemo";

const definitions = ObservableArray.givenValues<ExampleDefinition>([
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
    title: "Button",
    actor: new ButtonDemo({}),
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
