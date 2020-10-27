import { Test } from "@anderjason/tests";
import { ValuePath } from "@anderjason/util";
import { Koji } from ".";

Test.define("Koji receives instant remixing updates", () => {
  const imagePath = ValuePath.givenString("image");

  const os = Koji.instance.vccData;
  Test.assert(os.toOptionalValueGivenPath(imagePath) == null);

  Koji.instance.vccData.update(imagePath, "image.jpg");

  Test.assert(os.toOptionalValueGivenPath(imagePath) === "image.jpg");
});
