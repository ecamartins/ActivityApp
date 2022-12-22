import React, {Component} from 'react';
import '../styles/LeaderBoadEntry.css';
import {FaTrophy, FaAward}  from 'react-icons/fa';



class LeaderBoardEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className={"entry-container"}>
                <div className={"rank-icon"}>
                    <h3>{this.props.rank} </h3>
                    {this.props.rank == 1 ? <FaTrophy size={"5vh"}/>: <FaAward size={"5vh"}/>}
                </div>
                <div className={"sub-container"}>
                    <h3 className={"name"}>{this.props.first_name} {this.props.last_name}</h3>
                    <p>Total: {this.props.total_minutes} min</p>
                    {this.props.percentage > 100 ? <p>Completed: >100.0%</p>:<p>Completed: {this.props.percentage.toFixed(1)}%</p>}
                </div>
            </div>
        )
    }

}

export default LeaderBoardEntry
