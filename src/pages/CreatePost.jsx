import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import '../styles/CreatePost.css'
import { supabase } from "../../client";
import { useState } from "react";

const CreatePost = () => {
    // const getUserId = async () => {
    //     await supabase
    // }

    const [post, setPost] = useState({title: "", user_id: '1', content: ""})

    const createPost = async (event) => {
        event.preventDefault();
      
        try {
            const { data, error } = await supabase
                .from('Posts')
                .insert({title: post.title, user_id: post.user_id, content: post.content})
                .select();

            if (error) throw error;

            alert("Post created Successfully!");
        } catch (error) {
            alert("Error creating post: " + error.message);
        }
        window.location = "/";
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setPost( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
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
                        <input className="input-box" type="text" id="title" name="title" onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea className='input-box' id="content" name="content" rows="5" onChange={handleChange} required></textarea>
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