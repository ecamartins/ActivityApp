import '../../src/styles/ActivityList.css';
import { useState } from "react";

function ActivityList(props){
    const [isOpen, setIsOpen] = useState(false);

    function Toggle(){
        setIsOpen(!isOpen);
    }
    return (<div>
            <button onClick={Toggle}>Display Activities</button>
    {isOpen && <ul className="activityList1">
            <li>{props.inside}</li>
            <li>{props.outside}</li>
        </ul>}
        </div>
    )
}

export default ActivityList

