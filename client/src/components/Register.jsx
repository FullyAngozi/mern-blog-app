import { useState } from "react";
import{ useNavigate} from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const response = await fetch("https://mern-blog-app-43qr.onrender.com/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if(response.status === 200) {
      alert("registration success")
      navigate('/login')
    } else {
      alert("Action failed")
    }

    setUserName('')
    setPassword('')
  

  }

  
  return (
    <>
      <form className="register">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </form>
    </>
  );
};

export default Register;
