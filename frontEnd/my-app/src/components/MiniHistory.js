import React, {Component} from 'react';
import {DateTime} from "luxon";
import "../styles/MiniHistory.css";


const config = require('../config');

class MiniHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            log: [],
            first_name: '',
            last_name: ''
        }

    }

    componentDidMount() {
        this.getHistLog(this.props.week, this.props.year);
        this.getUserName();
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
            .then(res => this.setState({log: res}));
    }

    getUserName = () => {
        const id = encodeURIComponent(this.props.user_id);
        fetch(`${config.app.host}userName/?user_id=${id}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({
                first_name: res.first_name,
                last_name: res.last_name
            }));

    }

    getHistUI = () =>{
        let hist_display = [];
        let cur = {};
        let name = "";
        let total = 0;
        let duration = 0;
        let date = '';

        for (let i = 0; i < this.state.log.length; i++){
            cur = this.state.log[i];
            name= cur.activity_name;
            duration = cur.duration;
            total += duration;
            date = DateTime.fromISO(cur.date).toLocaleString(DateTime.DATE_MED); //convert date to format like Oct. 31, 2022
            hist_display[i] = <tr id={cur.hist_id}>
                <td className={"left-col"}>{name}</td>
                <td className={"mid-col"}>{duration}</td>
                <td className={"right-col"}>{date}</td>
            </tr>;
        }
        hist_display[this.state.log.length]=<tr><td></td><td className={"mid-col"} id={"total-mins"}>{total}</td><td></td></tr>;

        return hist_display;
    }

    handleClick =() =>{
        this.props.back_to_board();
    }

    render(){
        let dt = DateTime.fromObject({
            weekYear: this.props.year,
            weekNumber: this.props.week
        }).setZone('America/Vancouver');

        let week_date = dt.startOf('week').toFormat('MMMM dd, yyyy');

        return (
            <div className={"mini-hist"}>
                <h3>{this.state.first_name} {this.state.last_name}'s log for the week of {week_date}</h3>
                <table>
                    <thead>
                    <tr><th>Activity</th><th>Duration (min)</th><th>Date</th><th id={"trash-header"}></th></tr>
                    </thead>
                    <tbody>
                    {this.getHistUI()}
                    </tbody>
                </table>
                <button type={"button"} onClick={this.handleClick}>Back</button>
            </div>
        )
    }
}

export default MiniHistory
