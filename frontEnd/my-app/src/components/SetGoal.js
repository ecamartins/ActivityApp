import React, {Component} from "react";

class SetGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target_minutes: -1,
        }
    }

    handleSubmit = () => {

        const body = JSON.stringify(
            {
                user_id: this.props.user_id,
                target_minutes: this.state.target_minutes,
                week: this.props.week
            });

        fetch('http://localhost:4000/submitGoal', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })
        this.onEnterGoal();
    };

    onEnterGoal = () =>{
        this.props.sendGoal(this.state.target_minutes);
    }

    handleGoal = (event) => {
        let goal = event.target.value;
        this.setState({target_minutes: goal})
    }

    render() {
        console.log({
            user_id: this.props.user_id,
            target_minutes: this.props.target_minutes,
            week: this.props.week
        })
        return (
            <div className={"new-user-container"}>
                <form>
                    <label>Enter target Minutes for this week:</label>
                    <input type="number" defaultValue={0}  value={this.state.target_minutes} min={0} max={10000}
                           onChange={this.handleGoal}/>
                    <button value="Submit" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        )
    }
}

export default SetGoal