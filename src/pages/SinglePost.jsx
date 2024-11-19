import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useSupabaseClient } from "../../client";
import { useUser } from "@clerk/clerk-react";
import CommentForm from "./CommentForm";

const SinglePost = () => {
    const { id: id2 } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);    
    const [showCommentForm, setShowCommentForm] = useState(false);
   
    const client = useSupabaseClient();
    const { user, isSignedIn, isLoaded } = useUser(); 

    // Function to format date
    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to get ordinal number
    function getOrdinalNum(n) {
        return n + (["st","nd","rd"][((n+90)%100-10)%10-1] || "th");
    }

    // Fetch post, like status, and comments
    useEffect(() => {
        const fetchPostAndComments = async () => {
            if (!client) {
                console.error("Supabase client is not initialized.");
                return;
            }

            try {
                setIsLoading(true);

                // Fetch post data
                const { data: postData, error: postError } = await client
                    .from('Posts')
                    .select(`*`)
                    .eq('id', id2)
                    .single();

                if (postError) throw postError;

                setPost(postData);
                setLikeCount(postData.likes);

                // Fetch comments
                const { data: commentsData, error: commentsError } = await client
                    .from('Comments')
                    .select(`*`)
                    .eq('post_id', id2)
                    .order('created_at', { ascending: false });

                if (commentsError) throw commentsError;

                setComments(commentsData);

                // Check if the user has liked this post
                if (isSignedIn && user) {
                    const { data: likeData, error: likeError } = await client
                        .from('Post_Likes')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('post_id', id2);

                    if (likeError) throw likeError;

                    setIsLiked(likeData && likeData.length > 0);
                }
            } catch (error) {
                console.error('Error fetching post and comments:', error);
                setError(error.message || 'Failed to fetch post and comments');
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded && client) {
            fetchPostAndComments();
        }
        
    }, [id2, user?.id, isSignedIn, isLoaded, client]); 

    // Update like count
    const updateCount = async () => {
        if (!isSignedIn || !user) {
            alert('You must be logged in to like posts');
            return;
        }

        try {
            let newLikeCount = likeCount;

            if (isLiked) {
                // Unlike the post
                const { error: deleteError } = await client
                    .from('Post_Likes')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('post_id', id2);

                if (deleteError) throw deleteError;

                newLikeCount -= 1;
            } else {
                // Like the post
                const { error: insertError } = await client
                    .from('Post_Likes')
                    .insert({ user_id: user.id, post_id: id2 });

                if (insertError) throw insertError;

                newLikeCount += 1;
            }

            // Update the like count in the Posts table
            const { data, error: updateError } = await client
                .from('Posts')
                .update({ likes: newLikeCount })
                .eq('id', id2)
                .select();

            if (updateError) throw updateError;

            if (data && data.length > 0) {
                setLikeCount(data[0].likes);
                setIsLiked(!isLiked);
            } else {
                throw new Error('Failed to update post likes');
            }
        } catch (error) {
            console.error('Error updating like:', error);
            alert('Failed to update like status. Please try again.');
        }
    };

    const handleCommentAdded = (newComment) => {
        setComments([newComment, ...comments]);
        setShowCommentForm(false);
    };

    // Display loading state or errors
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
                <h4 className='username'>@{post.username} • {formatDate(post.created_at)}</h4>
                <p className="content">{post.content}</p>
                <p>This was the {getOrdinalNum(Number(id2))} post created on Eco Board!</p>
                <button className="likeButton" onClick={updateCount}>
                    👍 Like Count: {likeCount}
                </button>
                <br />
                <button className="comment-button" onClick={() => setShowCommentForm(!showCommentForm)}>
                    {showCommentForm ? 'Cancel' : 'Leave a comment'}
                </button>
                {showCommentForm && (
                    <CommentForm postId={id2} onCommentAdded={handleCommentAdded} />
                )}
                <div className="comments-section">
                    <h3>Comments</h3>
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p>{comment.content}</p>
                            <small>By @{comment.username} on {formatDate(comment.created_at)}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SinglePost;