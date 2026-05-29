import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm  from './components/LoginForm'
import CreateBlogForm from './components/createBlogForm'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
      }).catch(error => {
      showError('failed to create a new blog')
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs
          .map(b =>b.id !== blogObject.id ? b : returnedBlog)
          .sort((a, b) => b.likes - a.likes)
        )
        showNotification(`Liked blog ${returnedBlog.title}`)
      }).catch(error => {
        showError('failed to like blog')
      })
  }

  const deleteBlog = (blogId) => {
    blogService
      .remove(blogId)
      .then(returnedBlog => {
        setBlogs(blogs
          .filter(b => b.id !== blogId)
          .sort((a, b) => b.likes - a.likes)
        )
        showNotification(`removed blog ${returnedBlog.title} by ${returnedBlog.author}`)
      }).catch(error => {
        showError('failed to remove blog')
      })
  }

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

  if (user === null) {
    return(
      <div>
        <Notification message={notificationMessage} />
        <Error message={errorMessage} />
        <LoginForm
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
          password={password}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <h2>blogs</h2>
      <label>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </label>
      <Togglable buttonLabel="create new blog" ref={BlogFormRef}>
        <CreateBlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      )}
    </div>
  )
}

export default App