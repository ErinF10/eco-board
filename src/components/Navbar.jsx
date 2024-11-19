import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Navbar = () => {
    // const {user, isLoaded, isSignedIn} = useUser();

    // if ()
    const navItems = [
        {name: 'Home', path: '/'},
        { name: 'Create Post', path:'/create-post'},
        { name: 'My Posts', path: '/my-posts'}

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