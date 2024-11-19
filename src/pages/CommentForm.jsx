// CommentForm.jsx
import React, { useState } from 'react';
import { useSupabaseClient } from "../../client";
import { useUser } from "@clerk/clerk-react";

const CommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const client = useSupabaseClient();
    const { user, isSignedIn } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignedIn) {
            alert('You must be signed in to comment.');
            return;
        }
        try {
            const { data, error } = await client
                .from('Comments')
                .insert({ post_id: postId, user_id: user.id, username: user.username, content })
                .select();

            if (error) throw error;

            setContent('');
            onCommentAdded(data[0]);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment here..."
                required
            />
            <button type="submit">Comment</button>
        </form>
    );
};

export default CommentForm;