import React, {Component} from 'react';

class PersonalHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            duration: '',
            isShown: false
        }
        this.getActivityHistory = this.getActivityHistory.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.displayHistory = this.displayHistory.bind(this)
    }

    getActivityHistory() {
        fetch('http://localhost:4000/activityHistory')
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({activities: res}));
    }

    componentDidMount() {
        this.getActivityHistory();
    }

    getHistoryUI() {
        let activities = [];

        for (let i = 0; i < this.state.activities.length; i++){
            if (this.state.activities[i].name === this.state.name){
                activities.push(
                    <div>
                        {this.state.activities[i].activity}: {this.state.activities[i].duration}
                    </div>
                )
            }
        }
        return activities;
    }
    handleNameInput(event) {
        let name = event.target.value;
        this.setState({ name: name });
        // if don't change state here then isShown may be true when user hasn't hit submit
        this.setState({isShown: false})
    }

    displayHistory(){
        this.setState({isShown: !this.state.isShown})
    }

    render() {
        return (
            <div>
                <form>
                    Enter your name to view your activity history: <br/>
                    <label>
                        Name:
                        <input type="text" name="Name" onChange={this.handleNameInput}/>
                    </label>
                    <input type="button" value="Submit" onClick={this.displayHistory} />
                </form>
                {this.state.isShown && (
                    <div>{this.getHistoryUI()}</div>
                )}
            </div>
        )
    }
}

export default PersonalHistory
