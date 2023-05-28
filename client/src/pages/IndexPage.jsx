
import { useEffect, useState } from 'react'
import Blogcontent from '../components/Blogcontent'

const IndexPage = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://mern-blog-app-43qr.onrender.com/post');
        if (response.ok) {
          const posts = await response.json();
          setPosts(posts)
        } else {
          throw new Error('Failed to fetch posts');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <>
       {posts.length > 0 && posts.map(post => (
        <Blogcontent key={post._id}  {...post} />
       ))}
    </>
  )
}

export default IndexPage