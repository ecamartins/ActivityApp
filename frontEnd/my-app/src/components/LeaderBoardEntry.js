import React, {Component} from 'react';
import '../styles/LeaderBoadEntry.css';




class LeaderBoardEntry extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"container"}>
                <h3>{this.props.rank}</h3>
                <div className={"sub-container"}>
                    <h3 className={"name"}>{this.props.first_name} {this.props.last_name}</h3>
                    <p>{this.props.total_minutes}/{this.props.target_minutes} min Total</p>
                    <p>{this.props.percentage.toFixed(1)}% Complete</p>
                </div>
            </div>
        )
    }

}

export default LeaderBoardEntry
