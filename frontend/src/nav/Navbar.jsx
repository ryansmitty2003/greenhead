import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
                <li><Link to="/info">Info</Link></li>
            </ul>
        </nav>
    );
}
export default Navbar;