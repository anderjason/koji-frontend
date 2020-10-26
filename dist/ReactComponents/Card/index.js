"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const React = require("react");
const Card_1 = require("../../Card");
class Card extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._ref = React.createRef();
    }
    componentDidMount() {
        this._actor = new Card_1.Card({
            element: {
                type: "thisElement",
                element: this._ref.current,
            },
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
        return React.createElement("div", { ref: this._ref }, this.props.children);
    }
}
exports.Card = Card;
//# sourceMappingURL=index.js.map