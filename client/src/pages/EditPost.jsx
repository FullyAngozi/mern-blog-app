import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorQuill from "../EditorQuill";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [post, setPost] = useState("");
  const [postImage, setPostImage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://mern-blog-app-43qr.onrender.com/post/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await response.json();
        setPost(postData.post);
        setTitle(postData.title);
        setSummary(postData.summary);
      } catch (error) {
        console.error(error);
        // Handle error condition, e.g., display an error message
      }
    };

    fetchPost();
  }, [id]);

  const editPost = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("post", post);
      data.set("postImage", postImage?.[0]);

      const response = await fetch(`https://mern-blog-app-43qr.onrender.com/post/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        // Handle success condition, e.g., show a success message
        navigate(`/post/${id}`);
      } else {
        // Handle error condition, e.g., display an error message
      }
    } catch (error) {
      console.error(error);
      // Handle error condition, e.g., display an error message
    }
  };

  return (
    <form onSubmit={editPost}>
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
      <input type="file" onChange={(e) => setPostImage(e.target.files)} />

      {/* ReactQuill editor for post content */}
      <EditorQuill value={post} onChange={setPost} />

      {/* Button to submit the post */}
      <button className="create-post-btn">Update Post</button>
    </form>
  );
};

export default EditPost;
