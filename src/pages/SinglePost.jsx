import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { supabase } from "../../client";

const SinglePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    function formatDate(dateString) {
        const options = { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric',
          minute: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
      }

    function getOrdinalNum(n) {
        return n + (["st","nd","rd"][((n+90)%100-10)%10-1] || "th")
    }

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('Posts')
                    .select(`
                        *,
                        users:user_id (username)
                    `)
                    .eq('id', id)
                    .single();

                if (error) throw error;

                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="single-post">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="header-container">
                <Header page={`View Post`} />
            </div>
            <div className="main-content">
                <h2 className="title">{post.title}</h2>
                <h4 className='username'>@{post.users.username} • {formatDate(post.created_at)}</h4>
                <p className="content">{post.content}</p>
                <button className="likeButton" >👍 Like Count: 0</button>
                <p>This was the {getOrdinalNum(Number(id))} post created on Eco Board!</p>
            </div>
        </div>
    );
}

export default SinglePost;