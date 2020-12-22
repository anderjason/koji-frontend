import { Test } from "@anderjason/tests";
import { shouldRejectInput } from "./";

Test.define("shouldRejectInput returns the expected result", () => {
  Test.assertIsEqual(true, shouldRejectInput("a"));
  Test.assertIsEqual(true, shouldRejectInput("100a100"));
  Test.assertIsEqual(true, shouldRejectInput("abc"));
  Test.assertIsEqual(true, shouldRejectInput("a1"));

  Test.assertIsEqual(false, shouldRejectInput(null));
  Test.assertIsEqual(false, shouldRejectInput(""));
  Test.assertIsEqual(false, shouldRejectInput("."));
  Test.assertIsEqual(false, shouldRejectInput("$100."));
  Test.assertIsEqual(false, shouldRejectInput("$1.00"));
  Test.assertIsEqual(false, shouldRejectInput("1.00"));
  Test.assertIsEqual(false, shouldRejectInput("100"));
});
