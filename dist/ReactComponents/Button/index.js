"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const React = require("react");
const __1 = require("../..");
const Button_1 = require("../../Button");
class Button extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._ref = React.createRef();
    }
    componentDidMount() {
        this._actor = new Button_1.Button({
            element: {
                type: "thisElement",
                element: this._ref.current,
            },
            buttonMode: "ready",
            onClick: () => { },
            text: "Unlock now",
            theme: __1.KojiAppearance.themes.get("kojiBlack"),
        });
        this._actor.activate();
    }
    componentWillUnmount() {
        if (this._actor != null) {
            this._actor.deactivate();
            this._actor = undefined;
        }
    }
    render() {
        return React.createElement("button", { ref: this._ref });
    }
}
exports.Button = Button;
//# sourceMappingURL=index.js.map