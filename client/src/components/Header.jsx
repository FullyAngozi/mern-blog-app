import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Usercontext";

const Header = () => {
  const {userInfo, setUserInfo} = useContext(UserContext)

  useEffect(() => {
    fetch("https://mern-blog-app-43qr.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userinfo) => {
        setUserInfo(userinfo);
      });
    });
  }, []);

  function logOut() {
    fetch("https://mern-blog-app-43qr.onrender.com/logout", {
      credentials: "include",
      method: "POST"
    })

    setUserInfo(null)
  }

  const username = userInfo?.username

  return (
    <header>
      <Link to="/">Angozi Blog</Link>
      <nav>
        {username && (
          <>
            <Link to={"/create"}>Create new post</Link>
            <a onClick={logOut}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
