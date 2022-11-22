import React, { Component } from 'react';
import '../styles/Books.css'

// app.get, app.post, app.delete

const config = require('../config');

class ActivityLog2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            name: '',
            activity: '',
            duration: '',
            names: [],
            isShown: false,
            members: []
        };
        this.getNames = this.getNames.bind(this);
        this.getNamesList = this.getNamesList.bind(this);
        this.displayHistory = this.displayHistory.bind(this);
        this.getHistoryUI = this.getHistoryUI.bind(this);
        this.getNameAndID = this.getNameAndID.bind(this);
        this.getMemberActivties = this.getMemberActivties.bind(this);
    }

    getActivities() {
        fetch(`${config.app.host}activityLog`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ activities: res }));
    }

    getNameAndID() {
        fetch(`${config.app.host}members`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ members: res }));
    }


    getMemberActivties() {
        const nameID = encodeURIComponent(this.state.nameID);
        fetch(`${config.app.host}memberActivities/?nameID=${nameID}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ activties: res }));
    }

    componentDidMount() {
        this.getActivities();
        this.getNames();
        this.getNameAndID();
    }

    getHistoryUI() {
        let activities = [];

        for (let i = 0; i < this.state.activities.length; i++){
            if (this.state.activities[i].name === this.state.name){
                activities.push(
                    <div>
                        {this.state.activities[i].activity}: {this.state.activities[i].duration}
                    </div>
                )
            }
        }

        return activities;
    }


    getNames() {
        fetch('http://localhost:4000/activityLog2')
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({names: res}));

    }

    getNamesList() {
        //remove duplicates from list
        let temp = [];
        let unique_names = [];
        let index = 0;
        for (let i = 0; i < this.state.members.length; i++) {
            let cur = this.state.members[i];
            // if (!temp.includes(cur)) {
            //     temp.push(cur);
            //     // the value is the unique ID from the database
            //         //Activities: query from activties table
                unique_names[index]= <option value={cur.nameID}>{cur.name}</option>
                index++;

        }
        return unique_names;
    }

    displayHistory(event){
        let nameID =  event.target.value;
        this.setState({nameID: nameID});
        console.log(nameID);
        this.getMemberActivties();
        this.setState({isShown: !this.state.isShown});
    }

    //value is different than the display value

    render() {
        return (
            <div>
                <form>
                    <label>Select your name:</label>
                    <select value={this.state.nameID} onChange={this.displayHistory}>
                        {this.getNamesList()}
                    </select>
                </form>

                <div>{this.getHistoryUI()}</div>
            </div>
        );
    }
}

export default ActivityLog2;

