import React, {Component} from 'react';
import {DateTime} from "luxon";
import "../styles/WeekSelector.css"

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

    getWeek = (val) =>{
        return parseInt(val.slice(6,8));
    }

    handleDate = (event) => {
        let raw_value = event.target.value;

        // Extract year and week from raw string value
        let year = this.getYear(raw_value);
        let week = this.getWeek(raw_value);
        this.setState({year_num: year, week_num: week});

        //Send selected week to parent component
        this.props.sendWeek(this.state.week_num);
    }

    render(){
        const max_year = DateTime.local(DateTime.now()).weekYear;
        const max_week = DateTime.local(DateTime.now()).weekNumber;
        const max_entry = ""+max_year+"-W"+max_week;
        const cur = ""+this.state.year_num+"-W"+this.state.week_num;
        return(
            <div className={"week-container"}>
                <h1> Leader Board for:  </h1>
                <input
                    type="week"
                    name="week"
                    min="2022-W41"
                    value={cur}
                    max={max_entry} required
                    onChange={this.handleDate}>
                </input>
            </div>
        )
    }
}

export default WeekSelector


