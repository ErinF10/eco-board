import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useSupabaseClient } from '../../client.js'
import Card from "../components/Card";
import { useUser } from '@clerk/clerk-react';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { user, isLoaded, isSignedIn } = useUser();
    const client = useSupabaseClient();

    function formatDate(dateString) {
        const options = { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        const fetchPosts = async () => {

            try {
                if (client && user) {
                    const { data, error } = await client
                    .from('Posts')
                    .select(`*`)
                    .eq("user_id", user.id)
                    .order('created_at', { ascending: false });
                
                    if (error) throw error;
                    
                    const formattedPosts = data.map(post => ({
                        ...post,
                        created_at: formatDate(post.created_at)
                    }));
                    
                    setPosts(formattedPosts);
                }
        
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (client) {
            fetchPosts();
        }
    }, [client]); 

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="my-posts">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="header-container">
                <Header page='Home' />
            </div>
            <div className="main-content">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={`post-${post.id}`}>
                            <Card 
                                id={post.id} 
                                title={post.title} 
                                content={post.content}
                                username={post.username} 
                                created_at={post.created_at}
                                likes={post.likes}
                                update={true}
                            />
                        </div>
                    ))
                ) : (
                    <h2>No Posts Yet 😞</h2>
                )}
            </div>
        </div>
    );
};

export default MyPosts;