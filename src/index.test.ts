import { Test } from "@anderjason/tests";
import "./DisplayText/index.test";
import "./MoneyInput/index.test";

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
