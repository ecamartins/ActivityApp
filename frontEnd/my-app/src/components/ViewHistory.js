import React, {Component} from 'react';
import {DateTime} from "luxon";
import WeekSelector from "./WeekSelector";
import "../styles/ViewHistory.css";
import {IoTrash} from 'react-icons/io5';

const config = require('../config');

class ViewHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            week_num: DateTime.local().setZone('America/Vancouver').weekNumber,
            year_num: DateTime.local().setZone('America/Vancouver').year,
            history: [],
            is_on_enter_activity: false
        }

    }

    componentDidMount() {
        this.getHistLog(this.state.week_num);
    }

    getHistWeek = (week, year) =>{
        this.setState({week_num: week});
        this.setState({year_num: year});
        this.getHistLog(week, year);
    }

    getHistLog = (week, year) => {
        let dt = DateTime.fromObject({
            weekYear: year,
            weekNumber: week
        });
        dt = dt.setZone('America/Vancouver');
        let day_one_raw = dt.startOf('week');
        let day_seven_raw = dt.startOf('week').plus({ days: 6 });
        const day_one = encodeURIComponent(day_one_raw.toString());
        const day_seven = encodeURIComponent(day_seven_raw.toString());
        const id = encodeURIComponent(this.props.user_id);
        fetch(`${config.app.host}histLog/?day_one=${day_one}&day_seven=${day_seven}&user_id=${id}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({history: res}));
    }

    handleClick = () => {
        this.props.is_on_addToLog(true);
    }

    deleteEntry = (event) =>{
        let hist_id = event.currentTarget.id;

        const body = JSON.stringify(
            {
                hist_id: hist_id
            }
        );
        //delete the log entry with the given hist_id
        fetch(`${config.app.host}deleteLogEntry`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })
        // get updated history log for the given week and year
        this.getHistLog(this.state.week, this.state.year);
        this.getHistLog(this.state.week, this.state.year); //twice to deal with async problem
        // use this flag to "tell" the leaderboard to re-render
        this.props.is_on_addToLog(false);
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
        let cur_week = DateTime.local().setZone('America/Vancouver').weekNumber;
        let btn_visib = cur_week === this.state.week_num ? "visible" : "hidden";
        for (let i = 0; i < this.state.history.length; i++){
            cur = this.state.history[i];
            name= cur.activity_name;
            duration = cur.duration;
            total += duration;
            date = DateTime.fromISO(cur.date).toLocaleString(DateTime.DATE_MED); //convert date to format like Oct. 31, 2022
            hist_display[i] = <tr id={cur.hist_id}>
                                <td className={"left-col"}>{name}</td>
                                <td className={"mid-col"}>{duration}</td>
                                <td className={"right-col"}>{date}</td>
                                <td>
                                    <button
                                        style={{visibility: btn_visib}}
                                        id={cur.hist_id} type={"button"}
                                        className={"trash"}
                                        onClick={this.deleteEntry}>
                                            <IoTrash size={"3vh"}x/>
                                    </button>
                                </td>
                            </tr>;
        }
        return (
            <div>
                <div className={"history"}>
                    <table>
                        <thead>
                        <tr><th>Activity</th><th>Duration (min)</th><th>Date</th><th id={"trash-header"}></th></tr>
                        </thead>
                        <tbody>
                        {hist_display}
                        <tr><td></td><td className={"mid-col"} id={"total-mins"}>{total}</td><td></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    render(){
        const current_week = DateTime.local().setZone('America/Vancouver').weekNumber;
        let display_style = (this.state.week_num === current_week) && !this.props.hide_add_button ? "visible": "hidden"
        return (
            <div>
                <WeekSelector title={"Activity Log"} sendWeekAndYear = {this.getHistWeek}/>
                <div className={"add-btn-container"}>
                    <button style={{visibility: display_style}} type={"button"} className={"hist-button"} onClick={this.handleClick}>Add To Log</button>
                </div>
                {this.histUI()}
            </div>
        )
    }
}

export default ViewHistory
