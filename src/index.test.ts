import { Test } from "@anderjason/tests";
import "./KojiConfig/index.test";
import "./KojiUtil/index.test";

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
