import React, {Component} from 'react';
import {GiWeightLiftingUp}  from 'react-icons/gi';
import "../styles/Header.css";


class Header extends Component{
    constructor(props){
        super(props);
    }
    handleLogout = () =>{
        this.props.send_logout_flag(false);
    }

    render(){
        return (
            <div className={'header'}>
                <h1> <GiWeightLiftingUp/>Physical Activity Tracker</h1>
                {this.props.show_logout ? <button onClick={this.handleLogout}>Log-out</button> : null}
            </div>
        )
    }
}

export default Header
