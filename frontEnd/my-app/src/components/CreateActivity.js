import React, {Component} from 'react';
import "../styles/CreateActivity.css";

const config = require('../config');

class CreateActivity extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activity_id: -1,
            activity_name: "",
        }
    }

    handleSubmit = () => {
        let found = false;
        let activities = this.props.activities;
        for (let i = 0; i < activities.length; i++){
            if (activities[i].activity_name === this.state.activity_name){
                found = true;
                break;
            }
        }
        //only add new activity if it does not exist in current list
        if (!found) {
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
        this.setState({activity_name: event.target.value.toLowerCase()})
    }


    render(){
        return (
            <div className={"create-activity"}>
                <h2>Enter New Activity:</h2>
                <form>
                    <label><br/>Activity Name:<br/></label>
                    <input type="text" defaultValue={this.state.activity_name} placeholder="Activity Name"  onChange={this.handleActivityName}/>
                    <br/>
                    <button value="Submit" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        )
    }
}

export default CreateActivity;