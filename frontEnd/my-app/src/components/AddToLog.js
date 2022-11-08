import React, {Component} from "react";
import {DateTime} from "luxon";
import "../styles/AddToLog.css";
import CreateActivity from "./CreateActivity";

class AddToLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity_id: -1,
            activity_name: '',
            duration: 0,
            date: DateTime.local(DateTime.now()).toISODate(),
            activities: [],
            create_activity: false
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
        console.log("dur = "+ dur);
        this.setState({duration: dur});
    }

    handleDate = (event) =>{
        this.setState({date: event.target.value});

    }

    getActivityList = () => {
        fetch(`http://localhost:4000/activityList/`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ activities: res }));
    }

    getActivityDisplay = () => {
        let acts = this.state.activities;
        let display = [];
        for (let i = 0; i < acts.length; i++){
            let cur = acts[i];
            display[i] = <option value={cur.activity_id}>{cur.activity_name}</option>
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
        console.log("body = "+ body);

        fetch('http://localhost:4000/addToLog', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })

        this.setState({
            activity_id: -1,
            activity_name: '',
            duration: 0,
            date: DateTime.local(DateTime.now()).toISODate()}
        )
    }
    closeCreate = (flag) =>{
        this.setState({create_activity: flag});
    }

    getActId = (id) => {
        this.setState({activity_id: id});
    }

    render() {

        if (this.state.create_activity) {
            return (<CreateActivity sendActId={this.getActId} closeAct={this.closeCreate}/>)
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
                                <option value=''> -- select an activity --</option>
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