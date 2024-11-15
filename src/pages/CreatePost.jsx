import React from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import '../styles/createPost.css'
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
            console.log('test1');
            const { data, error } = await supabase
                .from('Posts')
                .insert({title: post.title, user_id: post.user_id, contents: post.content})
                .select();

            if (error) throw error;

            alert("Post created Successfully!");
        } catch (error) {
            alert("Error creating post: " + error.message);
        }
        window.location = "/";
    }

    const handleChange = (event) => {
        console.log('test2')
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

            <form className="create-post-form" onSubmit={createPost}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" rows="5" onChange={handleChange} required></textarea>
                </div>
                <div className="button-container">
                    <button type="submit">Create Post</button>
                </div>
            </form>


        </div>
    )
}

export default CreatePost;