import { useNavigate } from 'react-router-dom'
import { Paper, Button, Typography } from '@mui/material'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  console.log(user)
  console.log(blog)

  const navigate = useNavigate()

  const addLike = () => {
    updateBlog({
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    })
    //console.log("uui blogi objekti", newBlogObject)
  }

  const removeBlog = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  if (!blog) {
    return null
  }

  return(
    <div data-testid='blog-item'>
      <Paper variant='outlined' sx={{ p: 3, mt: 3, maxWidth: 600, borderRadius: 2 }}>
        <Typography variant='h6'>
          {blog.title}
        </Typography>
        <Typography variant='subtitle1'>
          by {blog.author}
        </Typography>
        <Typography variant="body1">
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </Typography>
        <Typography variant='subtitle1'>
          Added by {blog.user.name}
        </Typography>
        <Typography>
          {blog.likes} likes
        </Typography>
        {user && (
          <Button variant='outlined' onClick={addLike}>
            like
          </Button>
        )}
        {user && user.username === blog.user.username && (
          <Button variant="outlined" color="error" onClick={removeBlog}>
            Remove
          </Button>
        )}
      </Paper>
    </div>
  )
}

export default Blog