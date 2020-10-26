"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactBridge = void 0;
const React = require("react");
const ReactDOM = require("react-dom");
const observable_1 = require("@anderjason/observable");
const skytree_1 = require("skytree");
class ReactBridge extends skytree_1.Actor {
    onActivate() {
        if (this.props.props != null) {
            Object.keys(this.props.props).forEach((key) => {
                const val = this.props.props[key];
                if (observable_1.Observable.isObservable(val)) {
                    this.cancelOnDeactivate(val.didChange.subscribe(this.render));
                }
            });
        }
        this.cancelOnDeactivate(new observable_1.Receipt(() => {
            ReactDOM.unmountComponentAtNode(this.props.parentElement);
        }));
        this.render();
    }
    render() {
        const props = {};
        if (this.props.props != null) {
            Object.keys(this.props.props).forEach((key) => {
                const val = this.props.props[key];
                if (observable_1.Observable.isObservable(val)) {
                    props[key] = val.value;
                }
                else {
                    props[key] = val;
                }
            });
        }
        ReactDOM.render(React.createElement(this.props.component, props), this.props.parentElement);
    }
}
exports.ReactBridge = ReactBridge;
//# sourceMappingURL=index.js.map