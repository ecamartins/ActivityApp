import {Link} from 'react-router-dom'
import '../styles/NavBar.css';

function NavBar(props){
    return (
            <nav>
                <div className='container'>
                    <Link className='link' to='/Profile'>Profile</Link>
                    <Link className='link' to='/WeeklySchedule'>Weekly Schedule</Link>
                    <Link className='link' to='/Home'>Home</Link>
                </div>
            </nav>
    )
}

export default NavBar