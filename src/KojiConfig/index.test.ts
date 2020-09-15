import { Test } from "@anderjason/tests";
import { ValuePath, ObjectUtil } from "@anderjason/util";
import { PathBinding, ManagedObject } from "skytree";
import { KojiConfig } from ".";
import "./UndoManager.test";

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
  const obj = new ManagedObject();
  obj.init();

  const path = ValuePath.givenString("images.background");

  KojiConfig.instance.update(path, "file.jpg");

  const pathBinding = obj.addManagedObject(
    PathBinding.givenDefinition({
      input: (KojiConfig.instance as any)._internalData.value,
      path: path,
    })
  );

  Test.assert("file.jpg" === pathBinding.output.value);

  obj.uninit();
});
