import { Test } from "@anderjason/tests";
import { ValuePath } from "@anderjason/util";
import { KojiTools } from ".";

Test.define("KojiTools receives instant remixing updates", () => {
  const imagePath = ValuePath.givenString("image");

  const os = KojiTools.instance.vccData;
  Test.assert(os.toOptionalValueGivenPath(imagePath) == null);

  KojiTools.instance.vccData.update(imagePath, "image.jpg");

  Test.assert(os.toOptionalValueGivenPath(imagePath) === "image.jpg");
});
