import React, {Component} from 'react';
import "../styles/Body.css";
import Activities from "./Activities";
import ActivityLog2 from "./ActivityLog2";
import PersonalHistory from "./PersonalHistory";



class Body extends Component{

    render(){
        return(
            <div className={"container"}>
                <PersonalHistory className={"history"}/>
                <Activities className={"activities"}/>
                <ActivityLog2 className={"activities"}/>
            </div>

            )
    }

}

export default Body