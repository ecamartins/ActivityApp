import React, {Component} from 'react';
import "../styles/CreateUser.css";

class CreateUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            first_name: "",
            last_name: "",
        }
    }

    handleSubmit = () => {

        const body = JSON.stringify(
            {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
            });

        fetch('http://localhost:4000/createUser', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
            .catch(error => {
                console.log(error);
                alert("Error " + error)
            })

        //this.getNewActiveUser()
        this.setState({
            first_name: '',
            last_name: ''
        })
        this.handleClose();
    }
    //
    // getNewActiveUser= ()=>{
    //     fetch('http://localhost:4000/maxId')
    //         .then(res => res.text())
    //         .then(res => JSON.parse(res))
    //         .then(res => this.onCreateNewUser(res.id))
    //         .then(res => this.setState({ user_id: res.id}));
    //         //.then(res => this.onCreateNewUser(res.id));
    // }

    // onCreateNewUser = (id) =>{
    //     this.props.sendId(id);
    // }

    handleClose = () =>{
        this.props.close(false);
    }

    handleFirstName = (event) => {
        let first_name= event.target.value;
        this.setState({ first_name: first_name});
    }

    handleLastName = (event) => {
        let last_name= event.target.value;
        this.setState({ last_name: last_name});
    }


    render(){
        return (
            <div className={"new-user-container"}>
                <h2>New User:</h2>
                <form>
                    <label><br/>First Name:<br/></label>
                    <input type="text" defaultValue={this.state.first_name} placeholder="First Name"  onChange={this.handleFirstName}/>
                    <label><br/>Last Name:<br/></label>
                    <input type="text" defaultValue={this.state.last_name} placeholder="Last Name" onChange={this.handleLastName}/>
                    <br/>
                    <button value="Submit" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        )
    }
}

export default CreateUser;