import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggable from './components/Toggable'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  //const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" })
  const [user, setUser] = useState()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const createBlogFormRef = useRef()
  const sortLikes = (blog1, blog2) => blog1.likes > blog2.likes? 1:-1

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(sortLikes) )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
  
    try {
      const user = await loginService.login({username, password})
      
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)},3000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedNoteappUser')
  }


  const LoggedIn = () => {

    return (
    <div>

      {user.name} logged in
      <button id="logout-button" type='submit' onClick={handleLogout}>log out</button>

      <Toggable buttonLabel="create note" ref={createBlogFormRef}>
        <CreateBlogForm createBlog={createBlog} /> 
      </Toggable>
      
      {blogs.map(blog => 
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} removeBlog={removeBlog}/>
      )}
    </div>
    )
  }


  const createBlog = (blog) => {
    createBlogFormRef.current.toggleVisibility()
    blogService
    .create(blog)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${blog.title} by ${blog.author} added.`)
    })
  }

  const updateLikes = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    console.log(blog)
    const newBlog = {...blog, likes: blog.likes+1}
    console.log(newBlog)
    blogService.update(newBlog.id, newBlog)
    .then(updatedBlog => {
      setBlogs(blogs.map(blog => blog.id === id? updatedBlog: blog))
      setErrorMessage(`you liked ${updatedBlog.title} by ${updatedBlog.author}`)
    })
  }

  const removeBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    const flag = window.confirm(`remove blog ${blog.name} by ${blog.author}?`)
    if (flag) {
      blogService.remove(id).then(() => {
        const updatedBlogs = blogs.filter(blog => blog.id !== id).sort(sortLikes)
        setBlogs(updatedBlogs)
      }
      )
    }
  }



  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage}/>
      {console.log(user)}
      {user == null? 
      <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword}/> 
      : LoggedIn()}

    </div>
  )
}

export default App
