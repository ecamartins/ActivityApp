import React, {Component} from 'react';
import {FaTools}  from 'react-icons/fa';
import "../styles/TempLanding.css"

class TempLanding extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
        <div className={"landing-box"}>
            <h1>App Under Maintenance</h1>
            <FaTools class={"tools-icon"}/>
            <p>This physical activity app will be back up and running ASAP.</p>
        </div>)
    }

}

export default TempLanding;