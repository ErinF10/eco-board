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
    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [userId, setUserId] = useState(1)      
  
    const updateCount = async () => {
      console.log(likeCount);
      console.log(isLiked);
      console.log(post.likes)
      if (!userId) {
        alert('You must be logged in to like posts')
        return
      }
  
      let newLikeCount = likeCount;
  
      if (isLiked) {
        // Unlike the post
        const { error } = await supabase
          .from('Post_Likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', id)
  
        if (error) {
          console.error('Error unliking post:', error)
          return
        }
  
        setLikeCount(prevCount => prevCount - 1)
        setIsLiked(false)
        newLikeCount -= 1
     
      } else {
        // Like the post
        const { error } = await supabase
          .from('Post_Likes')
          .insert({ user_id: userId, post_id: id })
  
        if (error) {
          console.error('Error liking post:', error)
          return
        }
  
        setLikeCount(prevCount => prevCount + 1)
        setIsLiked(true)
        newLikeCount += 1
  
      }
  
      // Update the like count in the Posts table
      const { error } = await supabase
        .from('Posts')
        .update({ likes: newLikeCount })
        .eq('id', id)
  
      if (error) {
        console.error('Error updating post like count:', error)
      }
    }

    function formatDate(dateString) {
        const options = { 
          month: 'short', 
          day: 'numeric', 
        //   hour: 'numeric',
        //   minute: 'numeric'
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
                setLikeCount(data.likes);

                // Check if the user has liked this post
                const { data: likeData, error: likeError } = await supabase
                    .from('Post_Likes')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('post_id', id);

                if (likeError) throw likeError;

                setIsLiked(likeData && likeData.length > 0);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id, userId]);
    
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
                <button className="likeButton" onClick={updateCount} >👍 Like Count: {likeCount}</button>
                <p>This was the {getOrdinalNum(Number(id))} post created on Eco Board!</p>
            </div>
        </div>
    );
}

export default SinglePost;