# @anderjason/koji-frontend-tools

## Installation

`npm install --save @anderjason/koji-frontend-tools`

## Breaking changes from v6 to v7

### Removed KojiTools

* Use the `@withkoji/core` package in your project instead

### Removed ConfirmationPrompt

* Use the `@withkoji/core` package in your project instead

### Removed EditableText

* Use `FloatLabelTextInput` instead

### Removed RemixModeButton

### Removed RemixTarget

### Removed ThemeToolbar

### Removed themes from KojiAppearance

## Breaking changes from v5 to v6

### Card

* The `baseElement` property has been renamed to `element`
* The `baseFooterElement` property has been renamed to `footerElement`

### KojiTools

* When accessing VCC data, the path no longer includes "general" automatically. You'll need to include `general` as the first part of each VCC path when accessing values.

### DisplayText

* The `theme` prop has been removed

### SubmitButton

* The `theme` prop has been removed

### FloatLabelTextArea, FloatLabelTextInput, IntegerInput, and MoneyInput

* The `placeholder` prop has been renamed to `placeholderLabel`
* `isInvalid` has been replaced with a new `errorLabel` string prop. Whenever `errorLabel` contains a value, the field will change to an invalid state and display the error message

## API Reference

### AlignBottom

`TODO`

### Callout

`TODO`

### Card

`TODO`

### ConfirmationPrompt

`TODO`

### DisplayText

`TODO`

### EditableText

`TODO`

### FloatLabelTextarea

`TODO`

### FloatLabelTextInput

`TODO`

### IntegerInput

`TODO`

### KojiAppearance

`TODO`

### KojiNetworkUtil

`TODO`

### LoadingIndicator

Presents a loading animation to indicate that the page is loading.

#### Usage

To display in the center of the browser window:

```
// initialize the loading indicator
const receipt = LoadingIndicator.ofDocument().activate();

// uninitialize when finished
receipt.cancel();
```

To display as a child of another DOM element:

```
// get a reference to element
const parentElement = document.getElementById("some-id");

// initialize the loading indicator
const receipt = LoadingIndicator.givenParent(parentElement).activate();

// uninitialize when finished
receipt.cancel();
```

### MoneyInput

`TODO`

### OptionsList

`TODO`

### PublishButton

`TODO`

### RemixModeButton

`TODO`

### RemixTarget

Presents an interactive target area on the screen when Koji's instant remix feature is active. Tapping the target will open the VCC settings at the specified path.

#### Usage

You can create a remix target by specifying the coordinates of each corner as an array of points.

```
import { Observable } from "@anderjason/observable";
import { Point2 } from "@anderjason/geometry";
import { RemixTarget } from "@anderjason/koji-frontend-tools";
import { ValuePath } from "@anderjason/util";

const points = Observable.givenValue([
  // specify at least 3 points here
  Point2.givenXY(100, 100),  // top left
  Point2.givenXY(300, 100),  // top right
  Point2.givenXY(300, 200),  // bottom right
  Point2.givenXY(100, 200),  // bottom left
]);

const target = new RemixTarget({
  points,
  valuePath: ValuePath.givenParts(["general", "imageUrl"])
});

// initialize the target
const receipt = target.activate();

// Note: The target will only be visible when instant remixing is active

// uninitialize when finished
receipt.cancel();
```

#### Additional options

You can also set the color, stroke width, corner radius, and shape expansion (inset or expand the shape relative to the points).

To set these options, include them in the options object passed to either RemixTarget.ofElement() or RemixTarget.ofPoints().

```
import { Color } from "@anderjason/color";
import { ValuePath } from "@anderjason/util";

const target = new RemixTarget({
  color: Color.givenHex("#FF0000"),
  cornerRadius: 20,
  expansion: 10,
  points,
  strokeWidth: 5,
  valuePath: ValuePath.givenParts(["general", "imageUrl"]),
});
```

### SubmitButton

`TODO`

### ThemeToolbar

`TODO`

### ToggleButton

`TODO`
