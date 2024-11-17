import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const navItems = [
        {name: 'Home', path: '/'},
        { name: 'Create Post', path:'/create-post'},
        { name: 'Profile', path: '/profile' },
        { name: 'Settings', path: '/settings'},

    ]
    return (
        <div className="navbar">
            <h2>Eco Board</h2>
            <ul className="nav-items">
                {navItems.map((item, index) => (
                    <li key={index} className="nav-item">
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Navbar;