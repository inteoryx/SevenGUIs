import React from "react";
import './Counter.css';

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    increment() {
        this.setState({count: this.state.count + 1});
    }

    render() {
        return (
            <div className="counter">
                <div className="counterHeader">
                    Counter
                </div>
                <div className="counterBody">
                    <div />
                    <div 
                        className="counterText" 
                        value={this.state.count}
                        rows="1"
                        readOnly
                    >
                        {this.state.count}
                    </div>
                <button 
                    className="counterButton"
                    onClick={() => this.increment()}
                >
                    Click
                </button>
                <div />
                </div>
            </div>
        );
    }
}

export default Counter;