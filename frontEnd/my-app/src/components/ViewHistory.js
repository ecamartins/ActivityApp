import React, {Component} from 'react';
import {DateTime} from "luxon";
import WeekSelector from "./WeekSelector";
import "../styles/ViewHistory.css";

const config = require('../config');

class ViewHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            week_num: DateTime.local(DateTime.now()).weekNumber,
            history: [],
            is_on_enter_activity: false
        }

    }

    componentDidMount() {
        this.getHistLog(this.state.week_num);
    }

    getHistWeek = (week) =>{
        this.setState({week_num: week});
        this.getHistLog(week);
    }

    getHistLog = (week) => {
        const encoded_week = encodeURIComponent(week);
        const id = encodeURIComponent(this.props.user_id);
        fetch(`${config.app.host}histLog/?week_num=${encoded_week}&user_id=${id}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({history: res}));

    }

    handleClick = () => {
        this.props.is_on_addToLog(true);
    }

    histUI = () => {
        if (this.state.history.length == 0){
            return (
                <div className={"history"} id={"empty-log"}>
                    <p>Your log for this week is empty.</p><br/>
                    <p>You will appear on this week's leaderboard once you've logged > 0 minutes.</p>
                </div>
            )
        }

        let hist_display = [];
        let name = "";
        let duration = 0;
        let date;
        let cur = {};
        let total = 0;
        for (let i = 0; i < this.state.history.length; i++){
            cur = this.state.history[i];
            name= cur.activity_name.charAt(0).toUpperCase() + cur.activity_name.slice(1,cur.activity_name.length);
            duration = cur.duration;
            total += duration;
            date = DateTime.fromISO(cur.date).toLocaleString(DateTime.DATE_MED); //convert date to format like Oct. 31, 2022
            hist_display[i] = <tr id={cur.hist_id}><td>{name}</td><td className={"mid-col"}>{duration}</td><td className={"right-col"}>{date}</td></tr>;
        }
        return (
            <div>
                <div className={"history"}>
                    <table>
                        <tr><th>Activity</th><th>Duration (min)</th><th>Date</th></tr>
                        {hist_display}
                        <tr><td></td><td className={"mid-col"} id={"total-mins"}>{total}</td><td></td></tr>
                    </table>
                </div>
            </div>
        )
    }

    render(){
        const current_week = DateTime.local(DateTime.now()).weekNumber;
        let display_style = this.state.week_num === current_week ? "visible": "hidden"
        return (
            <div>
                <WeekSelector title={"Activity Log"} sendWeek = {this.getHistWeek}/>
                <button style={{visibility: display_style}} type={"button"} className={"hist-button"} onClick={this.handleClick}>Add To Log</button>
                {this.histUI()}
            </div>
        )
    }
}

export default ViewHistory
