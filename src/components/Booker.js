import React from "react";
import './Booker.css';

const validDate = (str) => {
    // parse a string in mm.dd.yyyy format
    try {
        let parts = str.split('.');
        let day = parseInt(parts[1], 10);
        let month = parseInt(parts[0], 10);
        let year = parseInt(parts[2], 10);
        let date = new Date(year, month - 1, day);
        return date;
    }
    catch (e) {
        console.log(e)
        return false;
    }
    
}

const BookingOptions = {
    "OneWay": {
        "Key": 0,
        "Valid": (departDate) => {
            let d = validDate(departDate);
            console.log("valid date", d && d > Date.now());
            return d && d > Date.now();
        }
    },
    "RoundTrip": {
        "Key": 1,
        "Valid": (departDate, returnDate) => {
            let d = validDate(departDate);
            let r = validDate(returnDate);
            return d && r && d < r && d > Date.now();
        }
    }
}

class Booker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            depart: "",
            return: "",
            valid: false,
            oneway: true,
            validityChecker: BookingOptions.OneWay.Valid,
        }
    }

    componentDidMount() {
        this.updateValidity();
    }

    updateValidity() {
        this.setState({
            valid: this.state.validityChecker(
                this.state.depart,
                this.state.return
            )
        });
    }

    optionSwitch(selection) {
        if (selection == BookingOptions.OneWay.Key) {
            this.setState({
                oneway: true,
                validityChecker: BookingOptions.OneWay.Valid
            }, this.updateValidity);
        }

        if (selection == BookingOptions.RoundTrip.Key) {
            this.setState({
                oneway: false,
                validityChecker: BookingOptions.RoundTrip.Valid
            }, this.updateValidity);
        }
    }

    render() {
        return (
            <div className="booker">
                <div className="bookerHeader">
                    Booker
                </div>
                <div className="bookerBody">
                    <div />
                    <select 
                        className="bookerBodyItem"
                        onChange={(e) => this.optionSwitch(e.target.value)}
                    >
                        <option value={BookingOptions.OneWay.Key}>
                            one-way flight
                        </option>
                        <option value={BookingOptions.RoundTrip.Key} >
                            return flight
                        </option>
                    </select>
                    <input 
                        className={"bookerBodyItem" + (this.state.valid ? "" : " invalid")}
                        type="text"
                        value={this.state.depart}
                        onChange={(e) => this.setState({depart: e.target.value}, this.updateValidity)}
                    />
                    <input 
                        className={"bookerBodyItem" + (this.state.valid || this.state.oneway ? "" : " invalid")}
                        type="text"
                        value={this.state.return}
                        disabled={this.state.oneway}
                        onChange={(e) => this.setState({return: e.target.value}, this.updateValidity)}
                    />
                    <button
                        className="bookerBodyItem"
                        disabled={!this.state.valid}
                    >
                        Book
                    </button>
                    <div />
                </div>
            </div>
        );
    }
}

export default Booker;