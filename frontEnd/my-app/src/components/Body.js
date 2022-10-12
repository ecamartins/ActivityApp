import React, {Component} from 'react';
import "../styles/Body.css";
import Activities from "./Activities";
import PersonalHistory from "./PersonalHistory";



class Body extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={"container"}>
                <PersonalHistory className={"history"}/>
                <Activities className={"activities"}/>
            </div>

            )
    }

}

export default Body