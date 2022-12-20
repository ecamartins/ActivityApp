import React, {Component} from "react";
import "../styles/SetGoal.css";
import {DateTime} from "luxon";

const config = require('../config');

class SetGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target_minutes: 0,
        }
    }

    handleSubmit = () => {

        const body = JSON.stringify(
            {
                user_id: this.props.user_id,
                target_minutes: this.state.target_minutes,
                week: this.props.week,
                year: DateTime.local().setZone('America/Vancouver').year
            });

        fetch(`${config.app.host}submitGoal`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })
        this.onEnterGoal();
    };

    onEnterGoal = () =>{
        this.props.sendGoal(this.state.target_minutes);
    }

    handleGoal = (event) => {
        let goal = event.target.value;
        this.setState({target_minutes: goal})
    }

    render() {
        return (
            <div className={"new-goal-container"}>
                <h2>Set goal for week {this.props.week}:</h2>
                <form>
                    <label>Enter target minutes for this week:</label><br/>
                    <input type="number" defaultValue={0}  value={this.state.target_minutes} min={0} max={10000}
                           onChange={this.handleGoal}/>
                    <button value="Submit" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        )
    }
}

export default SetGoal