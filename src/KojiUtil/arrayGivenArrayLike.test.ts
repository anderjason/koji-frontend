import { arrayGivenArrayLike } from "./arrayGivenArrayLike";
import { Test } from "@anderjason/tests";

Test.define("arrayGivenArrayLike returns an array given an array", () => {
  const input = ["a", "b", "c"];
  Test.assertIsDeepEqual(arrayGivenArrayLike(input), input);
});

Test.define(
  "arrayGivenArrayLike returns an array given an object with all int-like keys",
  () => {
    const input = { "0": "zero", "1": "one", 2: "two", "3": "three" };
    const actual = arrayGivenArrayLike(input);

    Test.assert(Array.isArray(actual));
    Test.assert(actual.length === 4);
    Test.assert(actual[1] === "one");
    Test.assert(actual[2] === "two");
  }
);

Test.define(
  "arrayGivenArrayLike returns the original input given an int",
  () => {
    Test.assertIsDeepEqual(arrayGivenArrayLike(10), 10);
  }
);

Test.define(
  "arrayGivenArrayLike returns the original input given a float",
  () => {
    Test.assertIsDeepEqual(arrayGivenArrayLike(3.1415), 3.1415);
  }
);

Test.define(
  "arrayGivenArrayLike returns the original input given a string",
  () => {
    Test.assertIsDeepEqual(arrayGivenArrayLike("hello"), "hello");
  }
);

Test.define(
  "arrayGivenArrayLike returns the original input given an array",
  () => {
    const input = ["a", "b", "c"];
    Test.assertIsDeepEqual(arrayGivenArrayLike(input), input);
  }
);

Test.define(
  "arrayGivenArrayLike returns the original input given undefined",
  () => {
    Test.assert(typeof arrayGivenArrayLike(undefined) === "undefined");
  }
);

Test.define("arrayGivenArrayLike returns the original input given null", () => {
  Test.assertIsDeepEqual(arrayGivenArrayLike(null), null);
});

Test.define(
  "arrayGivenArrayLike returns the original input given an object with at least one non-int key",
  () => {
    const input = {
      1: "test",
      2: "test",
      a: "test",
    };

    Test.assertIsDeepEqual(arrayGivenArrayLike(input), input);
  }
);

Test.define(
  "arrayGivenArrayLike returns the original input given an empty object",
  () => {
    const input = {};

    Test.assertIsDeepEqual(arrayGivenArrayLike(input), input);
  }
);
