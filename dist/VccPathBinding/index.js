"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VccPathBinding = void 0;
const observable_1 = require("@anderjason/observable");
const skytree_1 = require("skytree");
const Vcc_1 = require("../Vcc");
class VccPathBinding extends skytree_1.Actor {
    constructor(props) {
        super(props);
        if (props.output != null) {
            this.output = props.output;
        }
        else {
            this.output = observable_1.Observable.ofEmpty(observable_1.Observable.isStrictEqual);
        }
    }
    onActivate() {
        this.cancelOnDeactivate(Vcc_1.Vcc.instance.observableState.subscribe(this.props.vccPath, (vccValue) => {
            let result = vccValue;
            if (this.props.convertFromVcc != null) {
                result = this.props.convertFromVcc(result);
            }
            this.output.setValue(result);
        }, true));
        this.cancelOnDeactivate(this.output.didChange.subscribe((value) => {
            let result = value;
            if (this.props.convertToVcc != null) {
                result = this.props.convertFromVcc(result);
            }
            Vcc_1.Vcc.instance.observableState.update(this.props.vccPath, result);
        }));
    }
}
exports.VccPathBinding = VccPathBinding;
//# sourceMappingURL=index.js.map