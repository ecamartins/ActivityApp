import React, {Component} from 'react';
import {DateTime} from "luxon";
import "../styles/WeekSelector.css"





class WeekSelector extends Component{
    constructor(props){
        super(props);
        this.state = {
            year_num: DateTime.local(DateTime.now()).year,
            week_num: DateTime.local(DateTime.now()).weekNumber,
            date: DateTime.now().startOf('week')

        }
    }

    handleCurrentClick = () =>{
        this.setState({date: DateTime.now().startOf('week'),
                            week_num: DateTime.local(DateTime.now()).weekNumber,
                            year_num: DateTime.local(DateTime.now()).year});
        this.props.sendWeek(DateTime.local(DateTime.now()).weekNumber);
    }

    handlePrevClick = () =>{
        let prev_week = this.state.date.plus({ days: -7 });
        this.setState({week_num: prev_week.weekNumber,
                            year_num: prev_week.year,
                            date: prev_week});
        this.props.sendWeek(prev_week.weekNumber);
    }

    handleNextClick = () =>{
        let next_week = this.state.date.plus({ days: 7 });
        if (DateTime.now().startOf('week') < next_week){
            return;
        }
        this.setState({week_num: next_week.weekNumber,
            year_num: next_week.year,
            date: next_week});
        this.props.sendWeek(next_week.weekNumber);
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


