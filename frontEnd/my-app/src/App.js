import React, {Component} from 'react';
import './App.css';
import './styles/homeButton.css';
import HomeButton from './components/homeButton';
import ActivityList from "./components/ActivityList";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Layout from "./components/Layout";
import ActivityLog from "./components/Activities"
import PersonalHistory from "./components/PersonalHistory"
import {GiWeightLiftingUp}  from 'react-icons/gi';
import Header from "./components/Header"
import Body from "./components/Body"

class App extends Component {
    constructor(props) { //giving component  a state (things comp keeps track of)
        super(props);
        this.state = {
            buttonText: '', //first state
            buttonText2:'',
        }
    }
    getButtonText() {
        //grab hello world from backEnd
        console.log("above fetch")
        fetch(`http://localhost:4000/trial`)
            .then(res => res.text())
            .then(res => this.setState({buttonText: res}))

        //this.setState({buttonText: 'Testing testing'});
    }

    // getButton2Text() {
    //     fetch(`http://localhost:4000/trial`)
    //         .then(res => res.text())
    //         .then(res => this.setState({buttonText2: res})) //assignment
    //
    // }
// runs as soon as opens react app
    componentDidMount() { //builtin react function
        this.getButtonText(); //this is the function call
        //this.getButton2Text();
    }
    render(){
        return (
            <div className={"grid"}>

                <Header className={"Header"}/>
                <Body className={"Body"}/>

            </div>

        // <Router>
        //     <ActivityLog/>
        //     <PersonalHistory/>
        //     <Layout>
        //         <Routes>
        //             <Route path="/WeeklySchedule" element={<ActivityList inside='hockey' outside='soccer'/>} />
        //             <Route path="/Profile" element={<HomeButton buttonText = "Click" />} />
        //             <Route path="/Home" element={<HomeButton buttonText = "Click" />}/>
        //             <Route path="/*"></Route>
        //         </Routes>
        //     </Layout>
        // </Router>
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

export default App;
