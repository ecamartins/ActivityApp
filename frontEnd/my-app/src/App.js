import React, {Component} from 'react';
import'./App.css';

import Main from "./components/Main";
import Header from "./components/Header"


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            is_on_user_page: false,
        }
    }

    getLogoutFlag = (flag) =>{
        this.setState({is_on_user_page: flag});
    }

    render(){
        return (
            <div className={"page"}>
                <Header send_logout_flag={this.getLogoutFlag} show_logout={this.state.is_on_user_page}/>
                <div className={"main-container"}>
                    <Main send_logout_flag={this.getLogoutFlag} is_on_user_page={this.state.is_on_user_page} />
                </div>
            </div>)
    }
}

export default App;
