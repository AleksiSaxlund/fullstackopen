import { useNavigate } from 'react-router-dom'

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

  return (
    <div data-testid='blog-item'>
      <h2>{blog.author}: {blog.title}</h2>

      <div>
        <div>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          likes {blog.likes}
          {user && <button onClick={() => addLike()}>like</button>}
        </div>
        <div>
          Added by {blog.user.name}
        </div>
        {user && user.username === blog.user.username && (
          <div>
            <button onClick={() => removeBlog()}>remove</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog