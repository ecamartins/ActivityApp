import React, {Component} from 'react';
import WeekSelector from "./WeekSelector";
import LeaderBoardEntry from "./LeaderBoardEntry";
import MiniHistory from "./MiniHistory";
import "../styles/LeaderBoard.css";
import {DateTime} from "luxon";
import {BiRun} from "react-icons/bi";

const config = require('../config');

class LeaderBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ranking: [],
            week_num: DateTime.local().setZone('America/Vancouver').weekNumber,
            year: DateTime.local().setZone('America/Vancouver').year,
            show_log: false,
            log_user: -1
        }
    }

    componentDidUpdate(prevState, prevProps, snap) {
        if(this.props.update_board === true) {
            // delay function call for 500 milliseconds to ensure post call with new log entry is complete
            setTimeout(this.getRanking,500,this.state.week_num,this.state.year);
            // update is complete so set the state of get_board_update in Main to false
            this.props.update_incomplete(false);
        }
    }
    componentDidMount(){
        this.getRanking(this.state.week_num, this.state.year);
    }
    setWeekAndYear = (week, year) =>{
        this.setState({week_num: week});
        this.setState({year: year});
        this.getRanking(week, year);
    }
    getRanking = (week, year) => {
        let dt = DateTime.fromObject({
            weekYear: year,
            weekNumber: week
        }).setZone('America/Vancouver');

        let day_one_raw = dt.startOf('week');
        let day_seven_raw = dt.startOf('week').plus({ days: 6 });
        const day_one = encodeURIComponent(day_one_raw.toString());
        const day_seven = encodeURIComponent(day_seven_raw.toString());
        const encoded_year = encodeURIComponent(year);
        const encoded_week = encodeURIComponent(week);

        fetch(`${config.app.host}ranking/?week_num=${encoded_week}&day_one=${day_one}&day_seven=${day_seven}&year=${encoded_year}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ ranking: res }));
    }

    leaderBoardUI(){
        let leaderBoard = [];
        let rankings = this.state.ranking;

        for (let i = 0; i< rankings.length; i++){
            let entry = rankings[i];
            let percentage = entry.percent > 100 ? ">100" : entry.percent.toFixed(1) + "";
            leaderBoard[i] = <tr>
                                <td>{i+1}</td>
                                <td>{entry.first_name} {entry.last_name}</td>
                                <td>{entry.total}</td><td>{percentage}</td>
                                <td><button type={"button"} className={"log-btn"} id={entry.user_id} onClick={this.handleLogClick}>{<BiRun size={"3vh"}/>}</button></td>
                            </tr>;
        }

        return leaderBoard;
    }

    handleLogClick =(event) =>{
        this.setState({log_user: event.currentTarget.id, show_log: true});
    }

    currentWinner =() =>{
        let rankings = this.state.ranking;

        // if are zero users in rankings array don't display a winner
        let UI_length = Math.min(1, this.state.ranking.length);

        if (UI_length == 0){
            return null;
        }
        let entry = rankings[0];
        let winner = <LeaderBoardEntry
                            rank={1}
                            first_name={entry.first_name}
                            last_name={entry.last_name}
                            percentage={entry.percent}
                            target_minutes={entry.target_minutes}
                            total_minutes={entry.total}/>

        return winner;
    }

    backToBoard =()=>{
        this.setState({show_log: false});
    }

    render(){
        if (this.state.show_log === false){
            return(
                <div className={"board"}>
                    <WeekSelector title={"Leader Board"} sendWeekAndYear={this.setWeekAndYear}/>
                    {this.currentWinner()}
                    <div className={"ranking-container"}>
                        <table>
                            <thead>
                            <tr><th>Rank</th><th>Name</th><th>Completed (min)</th><th>Percentage Complete (%)</th><th>View Log</th></tr>
                            </thead>
                            <tbody>
                            {this.leaderBoardUI()}
                            </tbody>
                        </table>
                    </div>
                </div>)
        } else{
            return(
            <MiniHistory
                user_id={this.state.log_user}
                year={this.state.year}
                week={this.state.week_num}
                back_to_board={this.backToBoard}
            />
            )
        }
    }


}

export default LeaderBoard