import React, {Component} from 'react';
import "../styles/CreateActivity.css";

const config = require('../config');

class CreateActivity extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activity_id: -1,
            activity_name: "",
            invalid_activity: false,
            invalid_first_char: false,
            malicious_pattern: false,
            invalid_length: false
        }
    }

    handleSubmit = () => {
        if (this.state.invalid_activity){
            return;
        }

        //only add new activity if it does not exist in current list
        if (!this.isRepeat(this.state.activity_name)) {
            const body = JSON.stringify(
                {
                    activity_name: this.state.activity_name,
                });

            fetch(`${config.app.host}createActivity`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
                .then(res => {
                    this.closeCreateComponent();
                })
                .catch(error => {
                    console.log(error);
                    alert("Error " + error)
                })
        } else{
            alert("This activity already exists");
        }
        this.closeCreateComponent();
    };

    closeCreateComponent= () =>{
        this.props.create_activity(false);
    }

    handleActivityName = (event) => {
        let raw_activity = event.target.value;

        if (this.validFirstChar(raw_activity)){
            this.setState({invalid_first_char: false});
        } else{
            this.setState({invalid_first_char: true});
        }

        if (this.isMaliciousPattern(raw_activity)){
            this.setState({malicious_pattern: true});
        } else{
            this.setState({malicious_pattern: false});
        }

        if (this.isValidLength(raw_activity)){
            this.setState({invalid_length: false});
        }else{
            this.setState({invalid_length: true});
        }

        if (this.isValidActivity(raw_activity)){
            this.setState({invalid_activity: false});
        }else{
            this.setState({invalid_activity: true});
        }

        this.setState({activity_name: raw_activity.toLowerCase()})
    }

    validateSubmit = (event) => {
        let new_activity = event.target.value;

        // edge case: must check if user attempts to submit unchanged empty text box
        if (this.state.activity_name.length > 0){
            this.setState({invalid_length: false});
        }else{
            this.setState({invalid_length: true});
            return;
        }

        if (this.isValidActivity(new_activity)) {
            this.handleSubmit();
        }
    }

    validFirstChar = (raw_activity) => {
        // ensure the first character of the entered activity is a-z or A-Z
        const activity_pattern = new RegExp('^[a-zA-Z]+');

        return activity_pattern.test(raw_activity);
    }

    isMaliciousPattern = (raw_activity) => {
        // detect any malicious entries
        const malicious_pattern = new RegExp('[^a-zA-Z0-9 \s]+');

        return malicious_pattern.test(raw_activity);
    }

    isValidLength = (raw_activity) =>{
        return raw_activity.length > 0;
    }

    isValidActivity = (raw_activity) => {
        return (this.validFirstChar(raw_activity) &&
               !this.isMaliciousPattern(raw_activity) &&
                this.isValidLength(raw_activity));
    }

    isRepeat = (new_activity) =>{
        let activities = this.props.activities;

        for (let i = 0; i < activities.length; i++){
            let pat = new RegExp(`^${activities[i].activity_name}(?:ing|ed)?\s*$`);
            if (pat.test(new_activity) || activities[i] === new_activity){ //match found
                return true;
            }
        }
        // no match found
        return false;
    }

    render(){
        let text_colour = this.state.invalid_activity ? 'red' : 'black';
        let border_colour = this.state.invalid_activity ? 'red' : '#ccc';

        return (
            <div className={"create-activity"}>
                <h2>Enter New Activity</h2>
                <form>
                    <label style = {{color: text_colour}}><br/>Activity Name:<br/></label>
                    <input type="text"
                           style = {{color: text_colour, borderColor: border_colour}}
                           defaultValue={this.state.activity_name}
                           placeholder="Activity Name"
                           onChange={this.handleActivityName}/>
                    <br/>
                    <button type={"button"} value="Submit" onClick={this.validateSubmit}>Submit</button>
                    <button type={"button"} value="Cancel" onClick={this.closeCreateComponent}>Cancel</button>
                    {this.state.invalid_first_char ? <p>The first character of an activity must be in a-z or A-Z.</p>: null}
                    {this.state.malicious_pattern ? <p>An activity can only contain alphanumeric characters.</p>: null}
                    {this.state.invalid_length ? <p>An activity name length must be > 0.</p>: null}
                </form>
            </div>
        )
    }
}

export default CreateActivity;