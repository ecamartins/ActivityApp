import React, {Component} from 'react';
import {DateTime} from "luxon";
import "../styles/WeekSelector.css"
import {DatePicker} from "@mui/x-date-pickers";


class WeekSelector extends Component{
    constructor(props){
        super(props);
        this.state = {
            year_num: DateTime.local(DateTime.now()).year,
            week_num: DateTime.local(DateTime.now()).weekNumber
        }
    }

    getYear = (val) =>{
        return parseInt(val.slice(0,4));
    }

    handleDate = (event) => {
        let raw_value = event.target.value;

        // Extract year and week from raw string value
        let year = this.getYear(raw_value);
        let week = DateTime.fromISO(raw_value).weekNumber;
        this.setState({year_num: year, week_num: week});

        //Send selected week to parent component
        this.props.sendWeek(week);
    }

    render(){
        const max_year = DateTime.local(DateTime.now()).weekYear;
        const max_week = DateTime.local(DateTime.now()).weekNumber;
        const max_entry = ""+max_year+"-W"+max_week;
        const cur = ""+this.state.year_num+"-W"+this.state.week_num;
        return(
            <div className={"week-container"}>
                <h2> {this.props.title} for Week {this.state.week_num}</h2>
                <div>
                    {/*<DatePicker/>*/}
                <label className={"change-week"}>Change week:
                <input
                    type="week"
                    name="week"
                    min="2022-W41"
                    value={cur}
                    max={max_entry} required
                    onChange={this.handleDate}/>
                </label>
                </div>
            </div>
        )
    }
}

export default WeekSelector


