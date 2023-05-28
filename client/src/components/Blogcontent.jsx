import { Link } from "react-router-dom";
import PropTypes from 'prop-types';


const Blogcontent = ({ _id ,title, summary, postImage, author }) => {
  return (
    <>
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={"http://localhost:4000/" + postImage} alt="thumbnail" />
          </Link>
        </div>
        <div className="post-text">
          <Link to={`/post/${_id}`}>
            <h1>{title}</h1>
          </Link>
          <p>{author.username}</p>
          <p>{summary}</p>
        </div>
      </div>
    </>
  );
};

Blogcontent.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  post: PropTypes.string.isRequired,
  postImage: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

// Add this at the end of your component file


export default Blogcontent;
