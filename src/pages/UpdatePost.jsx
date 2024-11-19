import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import '../styles/CreatePost.css'
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from "../../client";

const UpdatePost = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: "loading...", content: "loading..." });

    const { user } = useUser();
       
    const client = useSupabaseClient();

   
    useEffect (() => {
        const getPostInfo = async () => {
            try {
                if (user && client) {
                    const {data, error} = await client 
                        .from('Posts')
                        .select('title, content')
                        .eq('id', id)
                
                    if (error) throw error
    
                    setPost({
                        title: data[0].title,
                        content: data[0].content
                    });
                }
         
            } catch (error) {
                console.log('error fetching post data: ', error)
            }
        }
        getPostInfo();

    }, [user, client, id])

    const updatePost = async (event) => {
        event.preventDefault();
      
        if (!user || !client) {
            alert("User not authenticated or client not ready");
            return;
        }

        try {
            const { data, error } = await client
                .from('Posts')
                .update({
                    title: post.title,
                    content: post.content,
                })
                .eq('id', id)
                .select();

            if (error) throw error;

            alert("Post updated Successfully!");
            navigate("/");
        } catch (error) {
            if (error.message.includes("JWT expired")) {
                alert("Your session has expired. Please log in again.");
                // Implement re-authentication logic here
                // For example, redirect to login page
                navigate("/https://good-penguin-55.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A5174%2F");
            } else {
                alert("Error updating post: " + error.message);
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
                <Header page='Update Post'/>
            </div>

            <div className="main-content">
                <form className="create-post-form" onSubmit={updatePost}>
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
                        <button type="submit">Update Post</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdatePost;