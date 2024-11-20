import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useSupabaseClient } from "../../client.js";
import Card from "../components/Card";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortMethod, setSortMethod] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    
    const client = useSupabaseClient();

    function formatDate(dateString) {
        const options = { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    const handleSortChange = (event) => {
        setSortMethod(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const fetchPosts = async () => {

            try {
                if (client) {
                    let query = client
                    .from('Posts')
                    .select(`*`);
                
                    if (searchQuery) {
                        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
                    }

                    if (sortMethod === 'recent') {
                        query = query.order('created_at', { ascending: false });
                    } else if (sortMethod === 'likes') {
                        query = query.order('likes', { ascending: false });
                    }
                
                    const { data, error } = await query;

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
    }, [client, sortMethod, searchQuery]); 

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
                <div className="filter-container">
                    <select name='sort' id='sort' value={sortMethod} onChange={handleSortChange}>
                        <option value="recent">Sort by most recent</option>
                        <option value="likes">Sort by most Likes</option>
                    </select>
                  <form>
                        <input 
                            name="search" 
                            id="search" 
                            placeholder="Search by keyword"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>
 
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

export default Home;