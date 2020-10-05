# @anderjason/koji-frontend

## Installation

`npm install --save @anderjason/koji-frontend`

## API Reference

### Vcc

`TODO`

### LoadingIndicator

Presents a loading animation to indicate that the page is loading.

#### Usage

To display in the center of the browser window:

```
// initialize the loading indicator
const handle = LoadingIndicator.ofDocument().init();

// uninitialize when finished
handle.release();
```

To display as a child of another DOM element:

```
// get a reference to element
const parentElement = document.getElementById("some-id");

// initialize the loading indicator
const handle = LoadingIndicator.givenParent(parentElement).init();

// uninitialize when finished
handle.release();
```

### KojiNetworkUtil

`TODO`

### RemixTarget

Presents an interactive target area on the screen when Koji's instant remix feature is active. Tapping the target will open the VCC settings at the specified path.

#### Usage

You can create a remix target by specifying the coordinates of each corner as an array of points.

```
import { Observable, Point2 } from "skytree";
import { RemixTarget } from "skytree-koji";

const points = Observable.givenValue([
  // specify at least 3 points here
  Point2.givenXY(100, 100),  // top left
  Point2.givenXY(300, 100),  // top right
  Point2.givenXY(300, 200),  // bottom right
  Point2.givenXY(100, 200),  // bottom left
]);

const target = RemixTarget.givenPoints(points, {
  vccPath: ["general", "imageUrl"]  // specify any VCC path here
});

// initialize the target
const handle = target.init();

// Note: The target will only be visible when instant remixing is active

// uninitialize when finished
handle.release();
```

#### Additional options

You can also set the color, stroke width, corner radius, and shape expansion (inset or expand the shape relative to the points).

To set these options, include them in the options object passed to either RemixTarget.ofElement() or RemixTarget.ofPoints().

```
import { Color } from "skytree";

const options = {
  vccPath: ["general", "imageUrl"],   // required property
  color: Color.ofHex("#FF0000"),      // optional
  strokeWidth: 5,                     // optional (default = 4)
  cornerRadius: 20,                   // optional (default = 30)
  expansion: 10,                      // optional (default = -10)
}

const target = RemixTarget.givenElement(element, options);
// or
const target = RemixTarget.givenPoints(points, options);
```
