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
            weekday: "Monday",
            border_colour: 'black',
            invalid_id: false,
            invalid_duration: false
        }
    }

    componentDidMount() {
        this.getActivityList();
    }

    handleDropDown = (event) =>{
        let act_id = event.target.value;
        if (act_id === "$"){
            this.setState({create_activity: true});
        }
        this.setState({activity_id: act_id});

        if (act_id != -2){
            this.setState({invalid_id: false});
        } else{
            this.setState({invalid_id: true});
        }
    }


    handleDuration = (event) =>{
        let dur = event.target.value;
        this.setState({duration: dur});

        if (dur > 0){
            this.setState({invalid_duration: false});
        } else {
            this.setState({invalid_duration: true});
        }
    }

    handleWeekday = (event) => {
        this.setState({weekday: event.target.value});
        this.weekdayToDate(event.target.value);
    }

    getDateOffset = (weekday) => {
        let offset = 0;
        switch(weekday){
            case "Sunday":
                offset++;
            case "Saturday":
                offset++;
            case "Friday":
                offset++;
            case "Thursday":
                offset++;
            case "Wednesday":
                offset++;
            case "Tuesday":
                offset++;
            default: // Monday will hit default case with offset of 0 as desired
        }

        return offset;
    }

    weekdayToDate = (weekday) => {
        let offset = this.getDateOffset(weekday);
        let correct_date = DateTime.now().startOf('week').plus({ days: offset });
        this.setState({date: correct_date});
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

    validateSubmit = () => {
        if (this.state.activity_id === -2 || this.state.duration <= 0){
            if (this.state.activity_id === -2){
                this.setState({invalid_id: true});
            }
            if (this.state.duration <= 0){
                this.setState({invalid_duration: true});
            }
            return;
        }

        this.handleSubmit();

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
            date: DateTime.local(DateTime.now()).startOf('week').toISODate()}
        )
        this.getActivityList();
        this.props.is_on_addToLog(false)
    }
    closeCreate = (flag) =>{
        this.getActivityList();
        this.props.is_on_addToLog(false);
        this.setState({create_activity: flag});
        this.setState({activity_id: -2}); // reset dropdown to display select activity option
    }

    handleCancel = () =>{
        this.props.is_on_addToLog(false);
    }

    getWeekdayUI = () =>{
        let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let weekday_options = [];

        for (let i = 0; i < weekdays.length; i++){
            let offset = this.getDateOffset(weekdays[i]);
            let entry = DateTime.now().startOf('week').plus({ days: offset }).toLocaleString(DateTime.DATE_HUGE);
            weekday_options[i] = <option id = {weekdays[i]} value={weekdays[i]}>{entry}</option>
        }
        return weekday_options;
    }

    render() {
        let activity_colour = this.state.invalid_id ? "red": "black";
        let activity_border = this.state.invalid_id ? "red": "#ccc";
        let duration_colour = this.state.invalid_duration ? "red": "black";
        let duration_border = this.state.invalid_duration ? "red": "#ccc";

        if (this.state.create_activity) {
            return (<CreateActivity activities = {this.state.activities}  create_activity={this.closeCreate}/>)
        }else {
                return (
                    <div className={"log-container"}>
                        <h2>Add to Weekly Log:</h2>
                        <form>
                            <label style={{color: activity_colour}}> Activity Name: </label>
                            <select style={{color: activity_colour, borderColor: activity_border}}
                                    className={"select-box"}
                                    value={this.state.activity_id}
                                    onChange={this.handleDropDown}>
                                <option value={-2}> -- select an activity --</option>
                                {this.getActivityDisplay()}
                                <option value={"$"}>-- add new activity --</option>
                            </select>
                            <br/>
                            <label style={{color: duration_colour}}> Duration (minutes): </label>
                            <input style={{color: duration_colour, borderColor: duration_border}}
                                   type="number" defaultValue={0}
                                   value={this.state.duration}
                                   onChange={this.handleDuration}/>
                            <br/>
                            <label>Day:</label>
                            <select id={"weekday-select"} className={"select-box"} value={this.state.weekday} onChange={this.handleWeekday}>
                                {this.getWeekdayUI()}
                            </select>
                            <br/>
                            <button type="button" value="Submit" onClick={this.validateSubmit}>Submit</button>
                            <button type="button" value="Cancel" onClick={this.handleCancel}>Cancel</button>
                            {this.state.invalid_id ? <p>Please select a valid activity</p>: null}
                            {this.state.invalid_duration ? <p>Please ensure duration is > 0 minutes</p>: null}
                        </form>
                    </div>
                )
            }
    }
}

export default AddToLog