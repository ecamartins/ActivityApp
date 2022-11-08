import React, {Component} from 'react';
import {DateTime} from "luxon";
import SetGoal from "./SetGoal";
import "../styles/UserProfile.css";
import AddToLog from "./AddToLog";

class UserProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: this.props.user_id,
            first_name: '',
            last_name: '',
            target_minutes: -1,
            total: 0,
            percent: 0,
            week: DateTime.local(DateTime.now()).weekNumber
        }
    }

    componentDidMount() {
        this.getUserName();
        this.getUserActivityHistory();
    }

    getUserName = () => {
        const id = encodeURIComponent(this.state.user_id);
        fetch(`http://localhost:4000/userName/?user_id=${id}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({
                first_name: res.first_name,
                last_name: res.last_name
            }));

    }


    getUserActivityHistory = () => {
        const id = encodeURIComponent(this.state.user_id);
        const cur_week = encodeURIComponent(this.state.week);
        fetch(`http://localhost:4000/userActivityHistory/?user_id=${id}&week=${cur_week}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({
                target_minutes: res.target_minutes,
                percent: res.percent,
                total: res.total
            }));

    }

    getRemaining = () => {
        let remaining = this.state.target_minutes - this.state.total;
        if (remaining < 0){
            remaining = 0;
        }
        return remaining;
    }

    getGoal = (goal) =>{
        this.setState({target_minutes: goal});
    }

    getPercentage = (total) =>{
        this.setState({percent: total/this.state.target_minutes});
    }

    render() {
        if (this.state.target_minutes == -1) {
            return (
                <div>
                <h1>{this.state.first_name} {this.state.last_name}'s Profile:</h1>
                <SetGoal
                    sendGoal={this.getGoal}
                    user_id={this.state.user_id}
                    target_minutes={this.state.target_minutes}
                    week={this.state.week}/>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>•• {this.state.first_name} {this.state.last_name}'s Profile ••</h1>
                    <h1>••••••••••••••••</h1>
                    <div className={"summary"}>
                        <h2>Weekly Goal: {this.state.target_minutes} min</h2>
                        <p>Remaining Minutes: {this.getRemaining()} min</p>
                        <p>Percentage Completed: {this.state.percent.toFixed(1)}%</p>
                    </div>
                    <AddToLog className={"log"} sendPercent={this.getPercentage} user_id={this.state.user_id}/>
                </div>)
        }
    }
}

export default UserProfile