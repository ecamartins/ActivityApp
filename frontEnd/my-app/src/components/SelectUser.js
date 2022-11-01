import React, {Component} from 'react';
import "../styles/SelectUser.css";

class SelectUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            first_name: "",
            last_name: "",
            users: []
        }
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleDropDown = this.handleDropDown.bind(this);
    }

    componentDidMount() {
        this.getCurrentUsers();
    }

    handleSubmit = (event) => {
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

    // handleDropDown(event){
    //     this.setState({user_id: event.target.value});
    // }

    handleDropDown = (event) => {
        this.setState({user_id: event.target.value});
    }

    render(){
        return (
            <div className={"log-in-container"}>
                <h2>Existing Users:</h2>
                <form>
                    <label>
                        User: <br/>
                        <select className={"select-box"} value={this.state.user_id} onChange={this.handleDropDown}>
                            <option value=''> -- select a user --</option>
                            {this.getUsersDisplay()}
                        </select>
                        <br/>
                        <button value="Submit" onClick={this.handleSubmit}>Submit</button>
                    </label>
                </form>
            </div>
        )
    }
}

export default SelectUser;