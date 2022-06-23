import { useState } from 'react'

const Blog = ({blog, updateLikes, removeBlog}) => {
  const [visible, setVisible] = useState(false)

  const style = {
    padding: 3,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  }

  return(
  <div style={style}>
    {blog.title} {blog.author}
    <button id="view-button" onClick={() => setVisible(!visible)}>{visible? 'hide': 'view'}</button>
    <BlogDetails blog={blog} visible={visible} updateLikes={updateLikes} removeBlog={removeBlog}/>
  </div>
  )
}


const BlogDetails = ({blog, visible, updateLikes, removeBlog}) => {
  if (!visible) return null
  const userAdded = blog.user && blog.user.name? blog.user.name: "anonymous"
  return (
    <div>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes}
        <button id="like-button" onClick={() => updateLikes(blog.id)}>like</button>
      </div>
      <div>
        {userAdded}
      </div>
      <div>
      <button id="remove-button" onClick={() => removeBlog(blog.id)}>remove</button>
      </div>
    </div>
  )
}


export default Blog