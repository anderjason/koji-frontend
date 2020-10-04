import { Observable } from "@anderjason/observable";
import { ValuePath } from "@anderjason/util";
import { Actor } from "skytree";
import { Vcc } from "../Vcc";

export interface VccPathBindingProps<T> {
  vccPath: ValuePath;

  output?: Observable<T>;
  convertToVcc?: (value: T) => any;
  convertFromVcc?: (value: any) => T;
}

export class VccPathBinding<T> extends Actor<VccPathBindingProps<T>> {
  readonly output: Observable<T>;

  constructor(props: VccPathBindingProps<T>) {
    super(props);

    if (props.output != null) {
      this.output = props.output;
    } else {
      this.output = Observable.ofEmpty<T>(Observable.isStrictEqual);
    }
  }

  onActivate() {
    this.cancelOnDeactivate(
      Vcc.instance.subscribe(
        this.props.vccPath,
        (vccValue) => {
          let result = vccValue;
          if (this.props.convertFromVcc != null) {
            result = this.props.convertFromVcc(result);
          }

          this.output.setValue(result);
        },
        true
      )
    );

    this.cancelOnDeactivate(
      this.output.didChange.subscribe((value) => {
        let result = value;
        if (this.props.convertToVcc != null) {
          result = this.props.convertFromVcc(result);
        }

        Vcc.instance.update(this.props.vccPath, result);
      })
    );
  }
}
