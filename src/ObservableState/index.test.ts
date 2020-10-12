import { Test } from "@anderjason/tests";
import { ObjectUtil, ValuePath } from "@anderjason/util";
import { PathBinding } from "skytree";
import { ObservableState } from ".";

Test.define(
  "ObservableState updates its internal data when passed a new value",
  () => {
    const path = ValuePath.givenString("images.background");

    const os = new ObservableState({});
    os.activate();

    os.update(path, "file.jpg");

    const actualValue = ObjectUtil.optionalValueAtPathGivenObject(
      (os as any)._internalData.value,
      path
    );

    Test.assert("file.jpg" === actualValue);

    os.deactivate();
  }
);

Test.define("ObservableState supports PathBinding", () => {
  const path = ValuePath.givenString("images.background");

  const os = new ObservableState({});
  os.activate();

  os.update(path, "file.jpg");

  const pathBinding = new PathBinding({
    input: (os as any)._internalData,
    path: path,
  });
  pathBinding.activate();

  Test.assert("file.jpg" === pathBinding.output.value);

  pathBinding.deactivate();

  os.deactivate();
});
