import React, {Component} from 'react';
import {DateTime} from "luxon";
import SetGoal from "./SetGoal";
import "../styles/UserProfile.css";
import AddToLog from "./AddToLog";
import ViewHistory from "./ViewHistory";

const config = require('../config');

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
            week: DateTime.local().setZone('America/Vancouver').weekNumber,
            year: DateTime.local().setZone('America/Vancouver').year,
            is_on_addToLog: false,
            weekly_goal_set: false
        }
    }

    componentDidMount() {
        this.getUserName();
        this.getUserActivityHistory();
    }

    getUserName = () => {
        const id = encodeURIComponent(this.state.user_id);
        fetch(`${config.app.host}userName/?user_id=${id}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({
                first_name: res.first_name,
                last_name: res.last_name
            }));

    }


    getUserActivityHistory = () => {
        let dt = DateTime.fromObject({
            weekYear: this.state.year,
            weekNumber: this.state.week,
        });
        dt = dt.setZone('America/Vancouver');
        let day_one_raw = dt.startOf('week');
        let day_seven_raw = dt.startOf('week').plus({ days: 6 });
        const day_one = encodeURIComponent(day_one_raw.toString());
        const day_seven = encodeURIComponent(day_seven_raw.toString());

        const week = encodeURIComponent(this.state.week);
        const year= encodeURIComponent(this.state.year);
        const id = encodeURIComponent(this.state.user_id);

        fetch(`${config.app.host}userActivityHistory/?user_id=${id}&day_one=${day_one}&day_seven=${day_seven}&week_num=${week}&year=${year}`)
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
        this.setState({weekly_goal_set: true});
    }

    hideAddToLog = (flag) =>{
        this.setState({is_on_addToLog: flag})
        this.getUserActivityHistory();
        this.props.is_on_create_activity(false);
    }

    render() {
        if (this.state.target_minutes == -1) {
            return (
                <div>
                    <div className={"user-profile"}>
                        <h1>•• {this.state.first_name} {this.state.last_name}'s Profile ••</h1>
                        <SetGoal
                            sendGoal={this.getGoal}
                            user_id={this.state.user_id}
                            target_minutes={this.state.target_minutes}
                            week={this.state.week}/>
                    </div>
                    <p id={"notice"}> Note: You will be permitted to add to your weekly log once you've set a goal.</p>
                    <ViewHistory
                        is_on_addToLog={this.hideAddToLog}
                        hide_add_button={!this.state.weekly_goal_set}
                        user_id={this.state.user_id}
                    />
                </div>
            )

        } else {
            let hist_display = <ViewHistory is_on_addToLog={this.hideAddToLog} user_id = {this.state.user_id}/>;
            let add_to_log = <AddToLog className={"log"} is_on_addToLog={this.hideAddToLog} hide_add_button={false} user_id={this.props.user_id}/>;
            let week_start = DateTime.local().setZone('America/Vancouver').startOf("week");
            let percent_done = this.state.percent > 100 ? ">100" : this.state.percent.toFixed(1)+"";
            return (
                <div className={"user-profile"}>
                    <h1>•• {this.state.first_name} {this.state.last_name}'s Profile ••</h1>
                    <div className={"summary"}>
                        <h2>Weekly Progress</h2>
                        <p>Week of {week_start.toFormat('MMMM dd, yyyy')}</p>
                        <table>
                            <thead>
                            <tr id={"table-header"}><th>Goal (min)</th><th>Remaining (min)</th><th>Percentage Completed (%)</th></tr>
                            </thead>
                            <tbody>
                            <tr><td>{this.state.target_minutes}</td><td>{this.getRemaining()}</td>{percent_done}</tr>
                            </tbody>
                        </table>
                    </div>
                    {this.state.is_on_addToLog ? add_to_log: hist_display}
                </div>
                )
        }
    }
}

export default UserProfile