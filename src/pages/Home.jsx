import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { supabase } from '../../client.js'
import Card from "../components/Card";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    function formatDate(dateString) {
        const options = { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        //   hour: 'numeric',
        //   minute: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
      }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('Posts')
                    .select(`*,                        
                        users:user_id (username)
                    `)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                // console.log('Raw data from database:', data);
                
                const formattedPosts = data.map(post => ({
                    ...post,
                    created_at: formatDate(post.created_at)
                }));
                
                // console.log('Formatted posts:', formattedPosts);
                
                setPosts(formattedPosts);
        
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []); 

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="home">
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
                            username={post.users.username}
                            created_at={post.created_at}
                            likes={post.likes}
                        />
                        {/* <p>Debug - Like count: {post.likes}</p> */}
                    </div>
                    ))
                ) : (
                    <h2>No Posts Yet 😞</h2>
                )}
            </div>
            
        </div>
    );
};

export default Home;