import React, {Component} from 'react';
import '../../src/styles/homeButton.css';

class HomeButton extends Component {
    constructor(props) { //giving component  a state (things comp keeps track of)
        super(props);
        this.state = {
            buttonText: '', //first state
        }
    }
    getButtonText() {
        //grab hello world from backEnd
        console.log("above fetch")
        fetch(`http://localhost:4000/`)
            .then(res => res.text())
            .then(res => this.setState({buttonText: res}))

        //this.setState({buttonText: 'Testing testing'});
    }

// runs as soon as opens react app
    componentDidMount() { //builtin react function
        this.getButtonText(); //this is the function call
    }
    render(){
        return ( //can only return 1 element
            <div>
                <button className="button1">{this.state.buttonText}</button> <br/>
            </div>
        )
    }
}
//react component always has a render function
/*
We make components with react (e.g. a button, drop down menu)
make small components and use as building blocks
Best practice: make small components and use in big components
react has its own set of buttons
 */

export default HomeButton;
