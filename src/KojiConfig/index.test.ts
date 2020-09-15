import { Test } from "@anderjason/tests";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { PathBinding } from "skytree";
import { KojiConfig } from ".";

Test.define(
  "KojiConfig updates its internal data when passed a new value",
  () => {
    const path = ValuePath.givenString("images.background");

    KojiConfig.instance.update(path, "file.jpg");

    const actualValue = ObjectUtil.optionalValueAtPathGivenObject(
      (KojiConfig.instance as any)._internalData.value,
      path
    );

    Test.assert("file.jpg" === actualValue);
  }
);

Test.define("KojiConfig supports PathBinding", () => {
  const path = ValuePath.givenString("images.background");

  KojiConfig.instance.update(path, "file.jpg");

  const pathBinding = new PathBinding({
    input: (KojiConfig.instance as any)._internalData.value,
    path: path,
  });
  pathBinding.activate();

  Test.assert("file.jpg" === pathBinding.output.value);

  pathBinding.deactivate();
});
