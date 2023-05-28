import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Usercontext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext)

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch("https://mern-blog-app-43qr.onrender.com/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo)
        setRedirect(true);
      })
    } else {
      alert("Wrong credentials")
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <form className="login" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Log in</button>
      </form>
    </>
  );
};

export default Login;
