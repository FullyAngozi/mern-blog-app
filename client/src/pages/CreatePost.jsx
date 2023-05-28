// Import the necessary dependencies
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import EditorQuill from "../EditorQuill";



// CreatePost component
const CreatePost = () => {
  // Define state variables for title, summary, and post content
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [post, setPost] = useState("");
  const [postImage, setPostImage] = useState('')
  const [redirect, setRedirect] = useState(false);

  // Handle form submission
  async function handlePost(e) {
    e.preventDefault();
    const data = new FormData()
    data.set('title', title )
    data.set('summary', summary )
    data.set('post', post )
    data.set('postImage', postImage[0] )
   const response = await fetch("https://mern-blog-app-43qr.onrender.com/post", {
        method: 'POST',
        body: data,
        credentials: 'include'
    })
    if(response.ok) {
        setRedirect(true)
    }
    
    // Add logic to handle the creation of the post
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  // Render the CreatePost component
  return (
    <form action="" onSubmit={handlePost}>
      {/* Input field for title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Input field for summary */}
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* Input field for file upload */}
      <input type="file"  onChange={e => setPostImage(e.target.files)} />

      <EditorQuill value={post} onChange={setPost} />

      {/* Button to submit the post */}
      <button className="create-post-btn">Create Post</button>
    </form>
  );
};

// Export the CreatePost component
export default CreatePost;
