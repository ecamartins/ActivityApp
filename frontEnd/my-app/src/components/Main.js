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
            show_logout: false
        }
    }

    setUserId = (id) =>{
        this.setState({user_id: id});
        this.displayLogout(!this.state.show_logout);
    }

    displayLogout = (flag) => {
        this.setState({show_logout: flag});
        this.props.send_logout_flag(flag);
    }

    render(){
        if (this.state.user_id == -1) {
            return (
                <div className={"account"}>
                    <h1>•• Log-in ••</h1>
                    <SelectUser parentCallback={this.setUserId} className={"existing-user"}/>
                    {/*<CreateUser parentCallback={this.setUserId} className={"create-user"}/>*/}
                </div>
            )
        } else{
            return(
                <div>
                <div className={"profile"}>
                    <LeaderBoard className={"board"}/>
                    <UserProfile className={"user-data"} user_id={this.state.user_id}/>
                </div>
                </div>

            )
        }
    }

}

export default Main;