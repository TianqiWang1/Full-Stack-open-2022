import { useState } from 'react' 

const CreateBlogForm = ({createBlog}) => {
  
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" })

  const AddBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }
    createBlog(blog)
    setNewBlog("")
    //setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added.`)
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={AddBlog}>
        <div>
        title <input type="text" value={newBlog.title} name="Title" onChange={({target}) => setNewBlog({...newBlog, title:target.value})}/>
        </div>
        <div>
        author <input type="text" value={newBlog.author} name="Author" onChange={({target}) => setNewBlog({...newBlog, author:target.value})}/>
        </div>
        <div>
        url <input type="text" value={newBlog.url} name="Url" onChange={({target}) => setNewBlog({...newBlog, url:target.value})}/>
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}
  export default CreateBlogForm