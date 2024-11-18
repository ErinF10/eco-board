import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";


const Header = (props) => {
    // const { user, isLoaded } = useUser()

    // if (!isLoaded) {
    //     // Handle loading state however you like
    //     return <div>Loading...</div>;
    // }  

    // console.log(user);

    return (
        <div className="header">
            <h2>{props.page}</h2>
            <header>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <div className="user-container">
                        {/* <p>{user.fullName}</p> */}
                        <UserButton />
                    </div>
 
                </SignedIn>
            </header>            
        </div>
    )
}

export default Header;