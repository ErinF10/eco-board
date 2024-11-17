import './styles/App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/create-post' element={<CreatePost />}/>
            <Route path='/post/:id' element={<SinglePost />} />
          </Routes>
      
      </BrowserRouter>
        
    </>
  )
}

export default App
