import React, {Component} from 'react';
import {GiWeightLiftingUp}  from 'react-icons/gi';
import "../styles/Header.css";


class Header extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className={'Header'}>
                <h1>Physical Activity Tracker <GiWeightLiftingUp/></h1>
            </div>
        )
    }
}

export default Header
