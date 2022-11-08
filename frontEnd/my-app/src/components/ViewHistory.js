import React, {Component} from 'react';
import {DateTime} from "luxon";
import WeekSelector from "./WeekSelector";

class ViewHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            week_num: DateTime.local(DateTime.now()).weekNumber
        }

    }
    getHistWeek = (week) =>{
        this.setState({week_num: week})
    }

    render(){
        return (
            <div>
                <WeekSelector title={"View History"} sendWeek = {this.getHistWeek}/>
            </div>
        )
    }
}

export default ViewHistory
