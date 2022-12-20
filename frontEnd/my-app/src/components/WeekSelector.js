import React, {Component} from 'react';
import {DateTime} from "luxon";
import "../styles/WeekSelector.css"

class WeekSelector extends Component{
    constructor(props){
        super(props);
        this.state = {
            year_num: DateTime.local().setZone('America/Vancouver').year,
            week_num: DateTime.local().setZone('America/Vancouver').weekNumber,
            date: DateTime.local().setZone('America/Vancouver').startOf('week')

        }
    }

    handleCurrentClick = () =>{
        let dt = DateTime.local().setZone('America/Vancouver');
        this.setState({date: dt.startOf('week'),
                            week_num: dt.weekNumber,
                            year_num: dt.year});
        this.props.sendWeekAndYear(dt.weekNumber, dt.year);
    }

    handlePrevClick = () =>{
        let prev_week = this.state.date.plus({ days: -7 });
        this.setState({week_num: prev_week.weekNumber,
                            year_num: prev_week.year,
                            date: prev_week});
        this.props.sendWeekAndYear(prev_week.weekNumber, prev_week.year);
    }

    handleNextClick = () =>{
        let next_week = this.state.date.plus({ days: 7 });
        let cur = DateTime.local().setZone('America/Vancouver').startOf('week');

        if (cur < next_week){
            return;
        }
        this.setState({week_num: next_week.weekNumber,
            year_num: next_week.year,
            date: next_week});
        this.props.sendWeekAndYear(next_week.weekNumber, next_week.year);
    }

        render(){
        return(
            <div className={"week-container"}>
                <h2> {this.props.title} </h2>
                <p>Week of {this.state.date.toLocaleString(DateTime.DATE_FULL)}</p>
                <div className={"mini-nav"}>
                    <button onClick={this.handlePrevClick}>Prev</button>
                    <button id={"cur"} onClick={this.handleCurrentClick}>Current Week</button>
                    <button onClick={this.handleNextClick}>Next</button>
                </div>
            </div>
        )
    }
}

export default WeekSelector


