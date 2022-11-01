import React, {Component} from 'react';
import SelectUser from "./SelectUser";
import CreateUser from "./CreateUser";
import UserProfile from "./UserProfile";
import LeaderBoard from "./LeaderBoard";
import "../styles/Main.css";

class Main extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: "", //make this -1 to keep it the same type
        }
    }

    componentDidMount() {

    }

    setUserId = (id) =>{
        this.setState({user_id: id})
    }

    render(){
        if (this.state.user_id == '') {
            return (
                <div className={"account"}>
                    <h1>•• Log-in ••</h1>
                    <SelectUser parentCallback={this.setUserId} className={"existing-user"}/>
                    <CreateUser parentCallback={this.setUserId} className={"create-user"}/>
                </div>
            )
        } else{
            return(
                <div className={"profile"}>
                    <LeaderBoard className={"board"}/>
                    <UserProfile className={"user-data"} user_id={this.state.user_id}/>
                </div>

            )
        }
    }

}

export default Main;