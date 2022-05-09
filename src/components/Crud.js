import React from "react";
import './Crud.css';
import PersonListView from "./PersonListView";

const PEOPLE = [
    { first: "David", last: "Wadsworth", key: 1},
    { first: "Thomas", last: "Wadsworth", key: 2},
    { first: "Vanessa", last: "Villa", key: 3},
];

class Crud extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            people: PEOPLE,
            filteredPeople: [],
            firstNameEntry: "",
            lastNameEntry: "",
            filterPrefix: "",
            selectedKey: null,
            lastAssignedId: PEOPLE.length + 1,
        };

        this.filterPeople = this.filterPeople.bind(this);
        this.createPerson = this.createPerson.bind(this);
        this.updateSelection = this.updateSelection.bind(this);
        this.deletePerson = this.deletePerson.bind(this);

    }

    componentDidMount() {
        this.filterPeople();
    }

    filterPeople() {
        let filteredPeople = this.state.people.filter((person) => {
            return this.prefixFilter(this.state.filterPrefix, person.last);
        });

        this.setState({
            filteredPeople: filteredPeople,
        });
    }

    prefixFilter(prefix, str) {
        if (prefix === "") {
            return true;
        }

        return str
            .toLowerCase()
            .startsWith(
                prefix.toLowerCase()
            );
    }

    createPerson(fname, lname) {
        let newPerson = {
            first: fname,
            last: lname,
            key: this.state.lastAssignedId + 1,
        };

        this.state.people.push(newPerson);
        this.setState({
            people: this.state.people,
            lastAssignedId: this.state.lastAssignedId + 1,
        }, this.filterPeople);
    }

    updateSelection(fname, lname, key) {
        this.setState({
            firstNameEntry: fname,
            lastNameEntry: lname,
            selectedKey: key,
        });
    }


    updatePerson(key, fname, lname) {
        let people = this.state.people;
        let person = people.find((person) => {
            return person.key === key;
        });
        
        if (person) {
            person.first = fname;
            person.last = lname;
            this.setState({
                people: people,
            });
        }

        this.filterPeople();
    }

    deletePerson(key) {
        let people = this.state.people;
        let person = people.find((person) => {
            return person.key === key;
        });

        if (person) {
            people.splice(people.indexOf(person), 1);
            this.setState({
                people: people,
            }, this.filterPeople);
        }

    }


    render() {
        return (
            <div className="crud">
                <div className="crudHeader">CRUD</div>
                <div className="crudBody">
                    <div />
                    <div className="crudBodyRow">
                        <div className="crudLabel">Filter prefix: </div>
                        <input
                            className="crudInput"
                            type="text"
                            value={this.state.filterPrefix}
                            onChange={(e) => {
                                this.setState({
                                    filterPrefix: e.target.value,
                                }, this.filterPeople);
                            }}
                            rows="1"
                        />
                    </div>
                    <div className="crudBodyRow">
                        <div className="crudColumn">
                            <PersonListView
                                people={this.state.filteredPeople}
                                onSelection={this.updateSelection}
                                selected={this.state.selectedKey}
                             />
                        </div>
                        <div className="crudColumn">
                            <div className="crudBodyRow">
                                <div className="crudLabel">First name: </div>
                                <input
                                    className="crudInput"
                                    type="text"
                                    value={this.state.firstNameEntry}
                                    onChange={(e) => {
                                        this.setState({
                                            firstNameEntry: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="crudBodyRow">
                                <div className="crudLabel">Last name: </div>
                                <input
                                    className="crudInput"
                                    type="text"
                                    value={this.state.lastNameEntry}
                                    onChange={(e) => {
                                        this.setState({
                                            lastNameEntry: e.target.value
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="crudBodyRow">
                        <button 
                            className="crudButton"
                            onClick={() => {
                                this.createPerson(this.state.firstNameEntry, this.state.lastNameEntry);
                                this.updateSelection("", "", null);
                                
                            }}
                        >Create</button>
                        <button 
                            className="crudButton"
                            disabled={this.state.selectedKey === null}
                            onClick={() => {
                                this.updatePerson(this.state.selectedKey, this.state.firstNameEntry, this.state.lastNameEntry);
                            }}
                        >Update</button>
                        <button 
                            className="crudButton"
                            disabled={this.state.selectedKey === null}
                            onClick={() => {
                                this.deletePerson(this.state.selectedKey);
                                this.updateSelection("", "", null);
                            }}
                        >Delete</button>
                    </div>
                </div>
                <div />
            </div>
        )
    }
}

export default Crud;