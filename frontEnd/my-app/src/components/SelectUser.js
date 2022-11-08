import React, {Component} from 'react';
import "../styles/SelectUser.css";
import CreateUser from "./CreateUser";

class SelectUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            first_name: "",
            last_name: "",
            users: [],
            createUser: false
        }
    }

    componentDidMount() {
        this.getCurrentUsers();
    }

    handleSubmit = () => {
        this.props.parentCallback(this.state.user_id);
    }

    getCurrentUsers(){
        let users = [];
        fetch('http://localhost:4000/members')
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
            dropdown_list[i] = <option value={cur.user_id}>{name}</option>;
        }

        return dropdown_list;
    }

    handleDropDown = (event) => {
        // if target value is -1, render the CreateUser component
        if (event.target.value == -1){
            this.setState({createUser: true});
        }
        this.setState({user_id: event.target.value});
    }

    closeComponent = (flag) =>{
        this.setState({createUser: flag});
        //this.getCurrentUsers();
    }
    getId = (id) =>{
        this.setState({user_id:id});
        this.getUsersDisplay();
    }

    render(){
        if (this.state.createUser){
            return(
                <div className={"log-in-container"}>
                    <CreateUser className={"new-user"} sendId={this.getId} close={this.closeComponent}/>
                </div>
            )
        } else {
            return (
                <div className={"log-in-container"}>
                    <h2>Existing Users:</h2>
                    <form>
                        <label>
                            User: <br/>
                            <select className={"select-box"} value={this.state.user_id} onChange={this.handleDropDown}>
                                <option value=''> -- select a user --</option>
                                {this.getUsersDisplay()}
                                <option value={-1}>-- create new user --</option>
                            </select>
                            <br/>
                            <button className={"select-button"} value="Submit" onClick={this.handleSubmit}>Submit</button>
                        </label>
                    </form>
                </div>
            )
        }
    }
}

export default SelectUser;