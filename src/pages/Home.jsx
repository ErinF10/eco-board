import React from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";


const Home = () => {
    return (
        <div className="home">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="header-container">
                <Header page='Home' />
            </div>
        </div>
    )
}

export default Home;