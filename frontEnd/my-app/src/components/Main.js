import React, {Component} from 'react';
import SelectUser from "./SelectUser";
import UserProfile from "./UserProfile";
import LeaderBoard from "./LeaderBoard";
import "../styles/Main.css";

class Main extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: -1,
            is_on_create_activity: false,
            get_board_update: false
        }
    }

    setUserId = (id) =>{
        this.setState({user_id: id});
        this.displayLogout(true);
    }

    displayLogout = (flag) => {
        this.props.send_logout_flag(flag);
    }

    onCreateActivity = (flag) =>{
        this.setState({is_on_create_activity: flag})
        // if we are no longer on the CreateActivity component this means we need to update the leaderboard
        if (flag == false){
            this.getBoardUpdate(true);
        }
    }
    getBoardUpdate = (flag) =>{
        this.setState({get_board_update: flag});
    }

    render(){
        if (!this.props.is_on_user_page) {
            return (
                <div className={"account"}>
                    <h1>•• Log-in ••</h1>
                    <SelectUser parentCallback={this.setUserId} className={"existing-user"}/>
                </div>
            )
        } else{
            return(
                <div>
                <div className={"profile"}>
                    <LeaderBoard className={"board"} update_incomplete={this.getBoardUpdate} update_board={this.state.get_board_update}/>
                    <UserProfile className={"user-data"} is_on_create_activity={this.onCreateActivity} user_id={this.state.user_id}/>
                </div>
                </div>

            )
        }
    }

}

export default Main;