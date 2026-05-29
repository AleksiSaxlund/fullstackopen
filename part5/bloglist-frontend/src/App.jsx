import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm  from './components/LoginForm'
import CreateBlogForm from './components/createBlogForm'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleCreateBlog = async () => {
    event.preventDefault()
    try {
      const blogObject = {
        title: title,
        author: author,
        url: url
      }
      const returnedBlog = await blogService.create(blogObject)
      //console.log('Olio from the bäk:', returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${title} by ${author} added`)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {
      showError('failed to craete new blog')
    }
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
          setUrl={setUrl}
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
      <CreateBlogForm
        title={title}
        author={author}
        url={url}
        setAuthor={setAuthor}
        setTitle={setTitle}
        setUrl={setUrl}
        handleCreateBlog={handleCreateBlog}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App