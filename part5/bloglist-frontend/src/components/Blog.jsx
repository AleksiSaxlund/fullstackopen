import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [infoVisible, setInfoVisible] = useState(false)
  console.log(user)
  console.log(blog)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

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
    }
  }

  return (
    <div style={blogStyle} data-testid='blog-item'>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setInfoVisible(!infoVisible)}>
          {infoVisible ? 'hide' : 'view'}
        </button>
      </div>

      {infoVisible && (
        <div>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes}
            <button onClick={() => addLike()}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          {user.username === blog.user.username && (
            <div>
              <button onClick={() => removeBlog()}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog