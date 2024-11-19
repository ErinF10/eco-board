import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import '../styles/Card.css'
import { Link } from 'react-router-dom'
import { useSupabaseClient } from '../../client'
import { useUser } from '@clerk/clerk-react'

const Card = (props) =>  {
  const { user, isLoaded, isSignedIn } = useUser();
  const [likeCount, setLikeCount] = useState(props.likes)
  const [isLiked, setIsLiked] = useState(false)

  const client = useSupabaseClient();

  const checkLikeStatus = useCallback(async () => {
    if (isSignedIn && user && client) {
      const { data, error } = await client
        .from('Post_Likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', props.id)
      
      if (data && data.length > 0) {
        setIsLiked(true)
      }
    }
  }, [isSignedIn, user, client, props.id]);

  useEffect(() => {
    checkLikeStatus()
  }, [isLoaded, isSignedIn, user, checkLikeStatus])

  const updateCount = async () => {
    if (!isSignedIn || !user) {
      alert('You must be logged in to like posts')
      return
    }
  
    try {
      let newLikeCount = likeCount;
  
      if (isLiked) {
        // Unlike the post
        const { error: deleteError } = await client
          .from('Post_Likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', props.id)
  
        if (deleteError) throw deleteError;
  
        newLikeCount -= 1;
      } else {
        // Like the post
        const { error: insertError } = await client
          .from('Post_Likes')
          .insert({ user_id: user.id, post_id: props.id })
  
        if (insertError) throw insertError;
  
        newLikeCount += 1;
      }
  
      // Update the like count in the Posts table
      const { data, error: updateError } = await client
        .from('Posts')
        .update({ likes: newLikeCount })
        .eq('id', props.id)
        .select()
  
      if (updateError) throw updateError;
  
      // Check if the update was successful
      if (data && data.length > 0) {
        setLikeCount(data[0].likes);
        setIsLiked(!isLiked);
      } else {
        throw new Error('Failed to update post likes');
      }
  
    } catch (error) {
      console.error('Error updating like:', error)
      // Optionally, revert the local state if the database update failed
      checkLikeStatus();
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete?")) {
      // User clicked OK (Yes)
      console.log("Deleting...");
      // Perform delete operation
      try {
        if (client) {
          const { data, error } = await client
            .from('Posts')
            .delete()
            .eq('id', props.id)
  
          if (error) {
            throw error
          }

          alert("Deleted post successfully")
        }
      } catch (error) {
        console.log('error deleting post: ' + error)
        if (error.code === '23503') {
          alert("Cannot delete this post because it is referenced by other data.");
        } else {
          alert(`Failed to delete post: ${error.message}`);
        }
      }
      
    } else {
        // User clicked Cancel (No)
        console.log("Delete cancelled");
    }
  }

  return (
      <div className="Card">
        <Link to={'/post/' + props.id}>
            <h2 className="title">{props.title}</h2>
            <h4 className='username'>@{props.username} • {props.created_at}</h4>
            <p className="content">{props.content}</p>
        </Link>
        <div className="button-container">
          <button className={`likeButton ${isLiked ? 'liked' : ''}`}  onClick={updateCount} >👍 Like Count: {likeCount}</button>
          {props.update &&
            <Link to={'/update-post/' + props.id}>
              <button className='update'>Update Post</button>
            </Link>
          }
          {props.update &&
            <button className='delete' onClick={handleDelete}>Delete Post</button>
          }
        </div>
      </div>
  );
};

export default Card;