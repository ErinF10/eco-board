import './styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';
import MyPosts from './pages/MyPosts';
import UpdatePost from './pages/UpdatePost';

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/create-post' element={<CreatePost />}/>
            <Route path='/post/:id' element={<SinglePost />} />
            <Route path='/my-posts' element={<MyPosts />} />
            <Route path="/update-post/:id" element={<UpdatePost />} />
          </Routes>
      
      </BrowserRouter>
        
    </>
  )
}

export default App
