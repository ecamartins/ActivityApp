import React, {Component} from 'react';
import '../styles/LeaderBoadEntry.css';
import {FaTrophy, FaAward}  from 'react-icons/fa';



class LeaderBoardEntry extends Component {
    constructor(props) {
        super(props);
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
                    <p>{this.props.total_minutes}/{this.props.target_minutes} min Total</p>
                    {this.props.percentage > 100 ? <p>>100.0% Complete</p>:<p>{this.props.percentage.toFixed(1)}% Complete</p>}
                </div>
            </div>
        )
    }

}

export default LeaderBoardEntry
