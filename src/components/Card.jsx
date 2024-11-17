import React from 'react'
import { useState } from 'react'
import '../styles/Card.css'
import { Link } from 'react-router-dom'


const Card = (props) =>  {

  const [count, setCount] = useState(0)
  const updateCount = () => {
    setCount((count) => count + 1);
  }

  return (
      <div className="Card">
        <Link to={'/post/' + props.id}>
            <h2 className="title">{props.title}</h2>
            <h4 className='username'>@{props.username} • {props.created_at}</h4>
            <p className="content">{props.content}</p>
        </Link>
            <button className="likeButton" onClick={updateCount} >👍 Like Count: {count}</button>
      </div>
  );
};

export default Card;