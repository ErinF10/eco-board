import React from 'react'
import { useState, useEffect } from 'react'
import '../styles/Card.css'
import { Link } from 'react-router-dom'
import { supabase } from '../../client'


const Card = (props) =>  {
  const [likeCount, setLikeCount] = useState(props.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [userId, setUserId] = useState(1)

  useEffect(() => {
    const checkLikeStatus = async () => {
      // This should be replaced with actual user authentication
      // const { data: { user } } = await supabase.auth.getUser()
      // if (user) {
      //   setUserId(user.id)
        const { data, error } = await supabase
          .from('Post_Likes')
          .select('*')
          .eq('user_id', userId)
          .eq('post_id', props.id)
        
        if (data && data.length > 0) {
          setIsLiked(true)
        }
    }

    checkLikeStatus()
  }, [props.id, userId])

  const updateCount = async () => {
    console.log(likeCount);
    console.log(isLiked);
    console.log(props.likes)
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
        .eq('post_id', props.id)

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
        .insert({ user_id: userId, post_id: props.id })

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
      .eq('id', props.id)

    if (error) {
      console.error('Error updating post like count:', error)
    }
  }
  

  return (
      <div className="Card">
        <Link to={'/post/' + props.id}>
            <h2 className="title">{props.title}</h2>
            <h4 className='username'>@{props.username} • {props.created_at}</h4>
            <p className="content">{props.content}</p>
        </Link>
            <button className={`likeButton ${isLiked ? 'liked' : ''}`}  onClick={updateCount} >👍 Like Count: {likeCount}</button>
      </div>
  );
};

export default Card;