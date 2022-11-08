import React, {Component} from 'react';
import "../styles/CreateActivity.css";

class CreateActivity extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activity_id: -1,
            activity_name: "",
        }
    }

    handleSubmit = () => {

        const body = JSON.stringify(
            {
                activity_name: this.state.activity_name,
            });

        fetch('http://localhost:4000/createActivity', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })

        this.getNewActivity()
    };

    getNewActivity= ()=>{
        fetch('http://localhost:4000/maxActId')
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ activity_id: res.id}));
        this.sendBack();
    }

    sendBack = () =>{
        this.props.sendActId(this.state.activity_id);
        this.props.closeAct(false);
    }

    handleActivityName = (event) => {
        this.setState({ activity_name: event.target.value});
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