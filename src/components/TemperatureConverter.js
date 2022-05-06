import React from "react";
import './TemperatureConverter.css';

class TemperatureConverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            f: "",
            c: "",
            error: false
        };
    }

    isValid(value) {
        //Return whether or not is a valid number
        return value && !isNaN(value);
    }

    ftoc(f) {
        if (this.isValid(f)) {
            this.setState({
                c: Math.round(((f - 32) * (5 / 9)) * 100) / 100 ,
                f: f,
                error: false
            });
        } else {
            this.setState({
                f: f,
                error: true
            });
        }

        
    }

    ctof(c) {
        if (this.isValid(c)) {
            this.setState({
                f: Math.round(((c * (9 / 5)) + 32) * 100) / 100 ,
                c: c,
                error: false
            });
        } else {
            this.setState({
                c: c,
                error: true
            });
        }
    }

    render() {
        return (
            <div className="tempConv">
                <div className="tempConvHeader">
                    TempConv
                </div>
                <div className="tempConvBody">
                    <div />
                    <textarea 
                        className="tempConvText"
                        value={this.state.c}
                        onChange={(e) => this.ctof(e.target.value)}
                        rows="1"
                    />
                    <div className="tempConvLabel">Celsius =</div>
                    <textarea 
                        className="tempConvText"
                        value={this.state.f}
                        onChange={(e) => this.ftoc(e.target.value)}
                        rows="1"
                    />
                    <div className="tempConvLabel">Fahrenheit</div>
                <div />
                </div>
            </div>
        );
    }
}

export default TemperatureConverter;