import React, {Component} from "react";
import "../styles/SetGoal.css";
import {DateTime} from "luxon";

const config = require('../config');

class SetGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target_minutes: 0,
            goal_above_zero: true,
            goal_is_int: true
        }
    }

    handleSubmit = () => {

        // if goal is not an int and is not >0 then don't submit
        if (!this.isValidGoal(this.state.target_minutes)){
            return;
        }

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

    isValidGoal = (goal) =>{
        goal = Number(goal);

        if (goal <= 0 || !Number.isInteger(goal)){
            if (goal <= 0){
                this.setState({goal_above_zero: false});
            } else{
                this.setState({goal_above_zero: true});
            }
            if (!Number.isInteger(goal)){
                this.setState({goal_is_int: false});
            } else{
                this.setState({goal_is_int: true});
            }

            return false;
        }

        // otherwise the goal is valid
        this.setState({goal_above_zero: true,  goal_is_int: true});
        return true;
    }

    handleGoal = (event) => {
        let goal = event.target.value;
        this.isValidGoal(goal);
        this.setState({target_minutes: goal})
    }

    render() {
        let week_start = DateTime.local().setZone('America/Vancouver').startOf("week");
        return (
            <div className={"new-goal-container"}>
                <h2>Weekly Goal</h2>
                <p>Week of {week_start.toFormat('MMMM dd, yyyy')}</p>
                <form>
                    <label>Enter your target minutes for this week:</label><br/><br/>
                    <input type="number" defaultValue={0}  value={this.state.target_minutes} min={0} max={10000}
                           onChange={this.handleGoal}/>
                    <button type={"button"} value="Submit" onClick={this.handleSubmit}>Submit</button>
                    {!this.state.goal_above_zero ? <p id={"invalid"}>Goal must be > 0 minutes.</p>: null}
                    {!this.state.goal_is_int? <p id={"invalid"}>Goal must be an integer.</p>: null}
                </form>
            </div>
        )
    }
}

export default SetGoal