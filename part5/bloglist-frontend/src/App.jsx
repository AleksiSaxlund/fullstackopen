import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm  from './components/LoginForm'
import CreateBlogForm from './components/createBlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const BlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs([...blogs].sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

      showNotification(`logged in as ${user.name}`)
    } catch {
      showError('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)
    showNotification('logged out sucessfully')
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        BlogFormRef.current.toggleVisibility()
      }).catch(() => {
        showError('failed to create a new blog')
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs
          .map(b => b.id !== blogObject.id ? b : returnedBlog)
          .sort((a, b) => b.likes - a.likes)
        )
        showNotification(`Liked blog ${returnedBlog.title}`)
      }).catch(() => {
        showError('failed to like blog')
      })
  }

  const deleteBlog = (blogId) => {
    const blogToRemove = blogs.find(b => b.id === blogId)

    blogService
      .remove(blogId)
      .then(() => {
        setBlogs(blogs
          .filter(b => b.id !== blogId)
          .sort((a, b) => b.likes - a.likes)
        )
        showNotification(`removed blog ${blogToRemove.title} by ${blogToRemove.author}`)
      }).catch(() => {
        showError('failed to remove blog')
      })
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const showNotification = message => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const showError = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const padding = {
    padding: 5
  }

  return(
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>

        {user ? (
          <>
            <Link style={padding} to="/create">new blog</Link>
            <button style={padding} onClick={handleLogout}>logout</button>
          </>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </div>

      <Notification message={notificationMessage}/>
      <Error message={errorMessage} />

      <Routes>
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />
        <Route path="/login" element={
          <LoginForm handleLogin={handleLogin} />
        } />
        <Route path="/create" element={
          <CreateBlogForm createBlog={addBlog} />
        } />
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            user={user}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        } />
      </Routes>
    </div>
  )
}

export default App