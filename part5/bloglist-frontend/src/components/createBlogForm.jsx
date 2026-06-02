import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import{ TextField, Button } from '@mui/material'

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            value={author}
            onChange={() => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            value={url}
            onChange={() => setUrl(event.target.value)}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateBlogForm