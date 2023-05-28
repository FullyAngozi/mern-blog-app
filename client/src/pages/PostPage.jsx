import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../Usercontext";

const PostPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://mern-blog-app-43qr.onrender.com/post/${id}`);
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          throw new Error("Failed to fetch post");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  if (!data) return null;

  return (
    <div className="post-page">
      <h1>{data.title}</h1>
      <p className="author">{`by ${data.author.username}`}</p>
      {userInfo.id === data.author._id && (
        <div className="edit-row">

          <Link to={`/edit/${data._id}`} className="edit-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`https://mern-blog-app-43qr.onrender.com/${data.postImage}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: data.post }}
      />
    </div>
  );
};

export default PostPage;
