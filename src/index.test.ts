import { Test } from "@anderjason/tests";
import "./ObservableState/index.test";
import "./Vcc/index.test";

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
