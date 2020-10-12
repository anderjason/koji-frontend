import { Test } from "@anderjason/tests";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { PathBinding } from "skytree";
import { Vcc } from ".";

Test.define("Vcc updates its internal data when passed a new value", () => {
  const path = ValuePath.givenString("images.background");

  Vcc.instance.update(path, "file.jpg");

  const actualValue = ObjectUtil.optionalValueAtPathGivenObject(
    (Vcc.instance as any)._internalData.value,
    path
  );

  Test.assert("file.jpg" === actualValue);
});

Test.define("Vcc supports PathBinding", () => {
  const path = ValuePath.givenString("images.background");

  Vcc.instance.update(path, "file.jpg");

  const pathBinding = new PathBinding({
    input: (Vcc.instance as any)._internalData,
    path: path,
  });
  pathBinding.activate();

  Test.assert("file.jpg" === pathBinding.output.value);

  pathBinding.deactivate();
});
