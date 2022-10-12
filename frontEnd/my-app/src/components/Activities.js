import React, { Component } from 'react';
import '../styles/Books.css'

// app.get, app.post, app.delete

class ActivityLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            name: '',
            activity: '',
            duration: ''
        };
    }

    getActivities() {
        console.log("in getActivities()")
        fetch('http://localhost:4000/activityLog')
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => this.setState({ activities: res }));
    }

    componentDidMount() {
        this.getActivities();
    }

    getActivityUI() {
        let activities = [];

        this.state.activities.forEach((activity) => {
            activities.push(
                // books have name, activity, duration
                <div>
                    {activity.name} did {activity.activity} for {activity.duration} minutes!
                </div>
            );
        });

        return activities;
    }

    handleNameInput = (event) => {
        let name = event.target.value;
        this.setState({ name: name });
    }

    handleActivityInput = (event) => {
        let activity = event.target.value;
        this.setState({ activity: activity });
    }

    handleDurationInput = (event) => {
        let duration = event.target.value;
        this.setState({ duration: duration });
    }

    submitActivity = () => {

        const body = JSON.stringify(
            {
                name: this.state.name,
                activity: this.state.activity,
                duration: this.state.duration,
            });

        console.log(body);
        fetch('http://localhost:4000/newActivity', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            });

        this.setState({
            name: '',
            activity: '',
            duration: '',
        })
        this.getActivities();
    };

    render() {
        return (
            <div>
                <div className='form'>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <label>Name</label>
                    <textarea color={"secondary"}
                              value={this.state.name}
                              label="Title"
                              style={{ width: "-webkit-fill-available" }}
                              onChange={this.handleNameInput} />
                    <label>Activity</label>
                    <textarea
                        value={this.state.activity}
                        label="Author ID"
                        style={{ width: "-webkit-fill-available" }}
                        onChange={this.handleActivityInput} />
                    <label>Duration</label>
                    <textarea color={"secondary"}
                              value={this.state.duration}
                              label="Book ID"
                              style={{ width: "-webkit-fill-available" }}
                              onChange={this.handleDurationInput} />
                </div>
                <div className='submitButtonContainer'>
                    <button
                        className='submitButton'
                        onClick={this.submitActivity}
                    > Add New Activity!
                    </button>
                </div>
                <div className='books'>
                    {this.getActivityUI()}
                </div>
            </div>
        );
    }
}

export default ActivityLog;

