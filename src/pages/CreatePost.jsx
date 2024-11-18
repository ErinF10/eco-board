import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import '../styles/CreatePost.css'
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from "../../client";

const CreatePost = () => {
    const [post, setPost] = useState({ title: "", content: "" });
    const navigate = useNavigate();

    const { user } = useUser();
       
    const client = useSupabaseClient();

    const createPost = async (event) => {
        event.preventDefault();
      
        if (!user || !client) {
            alert("User not authenticated or client not ready");
            return;
        }

        try {
            const { data, error } = await client
                .from('Posts')
                .insert({
                    title: post.title,
                    user_id: user.id,
                    content: post.content,
                    username: user.username
                })
                .select();

            if (error) throw error;

            alert("Post created Successfully!");
            navigate("/");
        } catch (error) {
            if (error.message.includes("JWT expired")) {
                alert("Your session has expired. Please log in again.");
                // Implement re-authentication logic here
                // For example, redirect to login page
                navigate("/https://good-penguin-55.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A5174%2F");
            } else {
                alert("Error creating post: " + error.message);
            }
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setPost(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div className="create-post">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="header-container">
                <Header page='Create Post'/>
            </div>

            <div className="main-content">
                <form className="create-post-form" onSubmit={createPost}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            className="input-box" 
                            type="text" 
                            id="title" 
                            name="title" 
                            value={post.title}
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea 
                            className='input-box' 
                            id="content" 
                            name="content" 
                            rows="5" 
                            value={post.content}
                            onChange={handleChange} 
                            required
                        ></textarea>
                    </div>
                    <div className="button-container">
                        <button type="submit">Create Post</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost;