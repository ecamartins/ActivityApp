import React, {Component} from 'react';
import WeekSelector from "./WeekSelector";
import LeaderBoardEntry from "./LeaderBoardEntry";
import "../styles/LeaderBoard.css";
import {DateTime} from "luxon";


class LeaderBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ranking: [],
            // default week_num is current week
            week_num: DateTime.local(DateTime.now()).weekNumber
        }
    }

    componentDidMount(){
        this.getRanking();
    }

    setWeekNum = (week) =>{
        this.setState({week_num: week})
        this.getRanking();
    }

    getRanking = () => {
        const week = encodeURIComponent(this.state.week_num);
        fetch(`http://localhost:4000/ranking/?week_num=${week}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ ranking: res }));
    }

    leaderBoardUI(){
        let leaderBoard = [];
        let rankings = this.state.ranking;
        for (let i = 0; i < rankings.length; i++){
            let entry = rankings[i]
            leaderBoard[i] = <LeaderBoardEntry
                                rank={i+1}
                                first_name={entry.first_name}
                                last_name={entry.last_name}
                                percentage={entry.percent}
                                target_minutes={entry.target_minutes}
                                total_minutes={entry.total}/>
        }

        return leaderBoard;
    }

    render(){
        return(
        <div className={"board"}>
            <WeekSelector sendWeek={this.setWeekNum}/>
            <div className={"ranking-container"}>
                {this.leaderBoardUI()}
            </div>
        </div>)
    }


}

export default LeaderBoard