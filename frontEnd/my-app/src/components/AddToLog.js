import React, {Component} from "react";
import {DateTime} from "luxon";
import "../styles/AddToLog.css";
import CreateActivity from "./CreateActivity";

const config = require('../config');

class AddToLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity_id: -2,
            activity_name: '',
            duration: 0,
            date: DateTime.local(DateTime.now()).toISODate(),
            activities: [],
            create_activity: false,
        }
    }

    componentDidMount() {
        this.getActivityList();
    }

    handleDropDown = (event) =>{
        if (event.target.value === "$"){
            this.setState({create_activity: true});
        }
        this.setState({activity_id: event.target.value});
    }


    handleDuration = (event) =>{
        let dur = event.target.value;
        this.setState({duration: dur});
    }

    handleDate = (event) =>{
        this.setState({date: event.target.value});

    }

    getActivityList = () => {
        fetch(`${config.app.host}activityList`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ activities: res }));
    }

    getActivityDisplay = () => {
        let acts = this.state.activities;
        let display = [];
        for (let i = 0; i < acts.length; i++){
            let cur = acts[i];
            display[i] = <option id={cur.activity_id} value={cur.activity_id}>{cur.activity_name}</option>
        }
        return display;
    }

    handleSubmit = () => {

        const body = JSON.stringify(
            {
                user_id: this.props.user_id,
                activity_id: this.state.activity_id,
                duration: this.state.duration,
                date: this.state.date
            }
        );

        fetch(`${config.app.host}addToLog`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })

        this.setState({
            activity_id: -2,
            activity_name: '',
            duration: 0,
            date: DateTime.local(DateTime.now()).toISODate()}
        )
        this.getActivityList();
        this.props.is_on_addToLog(false)
    }
    closeCreate = (flag) =>{
        this.getActivityList();
        this.setState({create_activity: flag});
        this.setState({activity_id: -2}); // reset dropdown to display select activity option
    }

    render() {

        if (this.state.create_activity) {
            return (<CreateActivity activities = {this.state.activities}  create_activity={this.closeCreate}/>)
        }else {
                const first_day_of_week = DateTime.now().startOf('week').toISODate();
                const today = DateTime.local(DateTime.now()).toISODate();
                return (
                    <div className={"log-container"}>
                        <h2>Enter Active Minutes:</h2>
                        <form>
                            <label> Activity Name: </label>
                            <select className={"select-box"} value={this.state.activity_id}
                                    onChange={this.handleDropDown}>
                                <option value={-2}> -- select an activity --</option>
                                {this.getActivityDisplay()}
                                <option value={"$"}>-- add new activity --</option>
                            </select>
                            <br/>
                            <label> Duration (minutes): </label>
                            <input type="number" defaultValue={0} value={this.state.duration} min={0} max={10000}
                                   onChange={this.handleDuration}/>
                            <br/>
                            <label>Date:</label>
                            <input id={"log-date"} type='date' value={this.state.date} min={first_day_of_week} max={today}
                                   onChange={this.handleDate}/>
                            <br/>
                            <button value="Submit" onClick={this.handleSubmit}>Submit</button>
                        </form>
                    </div>
                )
            }
    }
}

export default AddToLog