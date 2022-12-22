import React, {Component} from 'react';
import "../styles/CreateUser.css";

const config = require('../config');

class CreateUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: -1,
            first_name: "",
            last_name: "",
            valid_length: true,
            malicious_pattern: false,
            valid_first_char: true
        }
    }

    handleSubmit = () => {
        if (!(this.validateName(this.state.first_name) && this.validateName(this.state.last_name))){
            return;
        }
        // edge case for name length
        if (!(this.isValidLength(this.state.first_name) && this.isValidLength(this.state.last_name))){
            this.setState({valid_length: false});
            return;
        }

        if (!this.isRepeat(this.state.first_name, this.state.last_name)){
            const body = JSON.stringify(
                {
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                });

            fetch(`${config.app.host}createUser`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
                .then(res => {
                    this.backToLog();
                })
                .catch(error => {
                    console.log(error);
                    alert("Error " + error)
                })
            // user in database, now switch back to existing users component
            this.backToLog();
        } else{
            alert("User already exists.");
        }
    };

    validateName =(name) =>{
        if (!this.isValidName(name)){
            if (!this.validFirstChar(name)){
                this.setState({valid_first_char: false});
            } else{
                this.setState({valid_first_char: true});
            }

            if (this.isMaliciousPattern(name)){
                this.setState({malicious_pattern: true});
            } else{
                this.setState({malicious_pattern: false});
            }

            if (!this.isValidLength(name)){
                this.setState({valid_length: false});
            } else{
                this.setState({valid_length: true});
            }
            return false;
        }
        this.setState({valid_first_char: true,
                            malicious_pattern: false,
                            valid_length: true});

        return true; // denotes a valid name
    }

    isRepeat = (first_name, last_name) =>{
        let users = this.props.users;
        let found = false;
        for (let i = 0; i < users.length; i++){
            if (users[i].first_name === first_name && users[i].last_name === last_name){
                found = true;
                break;
            }
        }
        return found;
    }

    backToLog =() =>{
        this.props.is_on_create_user(false);
    }

    handleFirstName = (event) => {
        let first_name= event.target.value;
        this.validateName(first_name);
        first_name = this.toTitleCase(first_name);
        this.setState({ first_name: first_name});
    }

    handleLastName = (event) => {
        let last_name= event.target.value;
        this.validateName(last_name);
        last_name = this.toTitleCase(last_name);
        this.setState({ last_name: last_name});
    }

    toTitleCase = (name) =>{
        let first_char = name.charAt(0).toUpperCase();
        let suffix = name.slice(1, name.length).toLowerCase();

        return first_char + suffix;
    }

    validFirstChar = (raw_name) => {
        // ensure the first character of the entered activity is a-z or A-Z
        const activity_pattern = new RegExp('^[a-zA-Z]+');

        return activity_pattern.test(raw_name);
    }

    isMaliciousPattern = (raw_name) => {
        // detect any malicious entries
        const malicious_pattern = new RegExp('[^a-zA-Z\-]+');

        return malicious_pattern.test(raw_name);
    }

    isValidLength = (raw_name) =>{
        return raw_name.length > 0;
    }

    isValidName = (raw_name) => {
        return (this.validFirstChar(raw_name) &&
            !this.isMaliciousPattern(raw_name) &&
            this.isValidLength(raw_name));
    }


    render(){
        return (
            <div className={"new-user-container"}>
                <h2>New Users:</h2>
                <form>
                    <label><br/>First Name:<br/></label>
                    <input type="text" defaultValue={this.state.first_name} placeholder="First Name"  onChange={this.handleFirstName}/>
                    <label><br/>Last Name:<br/></label>
                    <input type="text" defaultValue={this.state.last_name} placeholder="Last Name" onChange={this.handleLastName}/>
                    <br/>
                    <button type={"button"} value="Submit" onClick={this.handleSubmit}>Submit</button>
                    <button type={"button"} value="Cancel" onClick={this.backToLog}>Cancel</button>
                    {!this.state.valid_first_char ? <p>The first character of both your first and last name<br/>must be in a-z or A-Z.</p>: null}
                    {this.state.malicious_pattern ? <p>A name can only contain alphanumeric characters.</p>: null}
                    {!this.state.valid_length ? <p>Both first and last name length must be > 0.</p>: null}
                </form>
            </div>
        )
    }
}

export default CreateUser;