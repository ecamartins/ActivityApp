import React, {Component} from 'react';
import "../styles/SelectUser.css";
import "./CreateUser";
import CreateUser from "./CreateUser";

const config = require('../config');

class SelectUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: -2, // -2 is the value for selecting user option on dropdown
            first_name: "",
            last_name: "",
            users: [],
            is_on_create_user: false,
        }
    }

    componentDidMount() {
        this.getCurrentUsers();
    }

    handleSubmit = () => {
        if (this.state.user_id == -2){
            alert("Invalid user.\nPlease select a user from the dropdown menu.");
            return;
        }
        this.props.parentCallback(this.state.user_id);
    }

    getCurrentUsers(){
        let users = [];
        fetch(`${config.app.host}members`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ users: res }))
    }


    getUsersDisplay() {
        let users = this.state.users;
        let dropdown_list = [];
        for (let i = 0; i < users.length; i++) {
            let cur = users[i]
            let name = cur.first_name + " " + cur.last_name;
            dropdown_list[i] = <option id={cur.user_id} value={cur.user_id}>{name}</option>;
        }

        return dropdown_list;
    }

    handleDropDown = (event) => {
        if (event.target.value == -1){
            this.setState({is_on_create_user: true});
        }
        this.setState({user_id: event.target.value});
    }

    closeCreateUser =(flag) =>{
        this.getCurrentUsers();
        this.setState({is_on_create_user: flag});
        this.setState({user_id: -2}); //change back to default id of -2
    }

    render() {
        if (this.state.is_on_create_user){
            return(
                <div className={"log-in-container"}>
                    <CreateUser
                        className={"new-user"}
                        is_on_create_user={this.closeCreateUser}
                        users = {this.state.users}
                    />
                </div>
            )
        }
        return (
            <div className={"log-in-container"}>
                <h2>Existing Users:</h2>
                <form>
                    <label>
                        User: <br/>
                        <select className={"select-box"} value={this.state.user_id} onChange={this.handleDropDown}>
                            <option value={-2}> -- select a user --</option>
                            {this.getUsersDisplay()}
                            <option value={-1}>-- create new user --</option>
                        </select>
                        <br/>
                        <button type={"button"} className={"select-button"} value="Submit" onClick={this.handleSubmit}>Submit</button>
                    </label>
                </form>
            </div>
        )
    }
}

export default SelectUser;