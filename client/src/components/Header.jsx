import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Usercontext";

const Header = () => {
  const {userInfo, setUserInfo} = useContext(UserContext)

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userinfo) => {
        setUserInfo(userinfo);
      });
    });
  }, []);

  function logOut() {
    fetch("http://localhost:4000/logout", {
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
