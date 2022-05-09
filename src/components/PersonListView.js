import React from "react";
import './PersonListView.css';

class PersonListView extends React.Component {
    constructor(props) {
        super(props);

        let people = new Map();

        for(let i = 0; i < props.people.length; i++) {
            let person = props.people[i];
            people.set(person.key, person);
        }

        this.state = {
            people: people,
        };

        this.setSelection = this.setSelection.bind(this);
    }

    setSelection(key) {
        this.setState({
            selection: key,
        });

        let person = this.state.people.get(key);
        if(person) {
            this.props.onSelection(person.first, person.last, person.key);
        } else {
            this.props.onSelection("", "", null);
        }
    }

    static getDerivedStateFromProps(props, state) {
        let people = new Map();
        let selectionStillValid = false;

        for(let i = 0; i < props.people.length; i++) {
            let person = props.people[i];
            people.set(person.key, person);

            if(props.selected === person.key) {
                selectionStillValid = true;
            }
        }

        if(!selectionStillValid && props.selected !== null) {
            props.onSelection("", "", null);
        }

        return {
            people: people,
        };
    }

    render() {
        return (
            <div className="listView">
                {
                    [...this.state.people.keys()].map(key => {
                        let person = this.state.people.get(key);
                        return (
                            <div key={key}
                                className={"listViewRow" + (this.props.selected === key ? " selected" : "")}
                                onClick={() => {
                                    this.setSelection(key);
                                }}
                            >
                                {person.last}, {person.first}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default PersonListView;