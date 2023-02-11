import React from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
  const navigate = useNavigate();

  const initialUserState = {
    name: "",
    id: "",
  };

  const [user, setUser] = React.useState(initialUserState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const logIn = () => {
    login(user);
    navigate("/");
  };
  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input type="text" className="form-control" id="name" required value={user.name} onChange={handleInputChange} name="name" />
        </div>
        <div>
          <label htmlFor="id">ID</label>
          <input type="text" className="form-control" id="id" required value={user.id} onChange={handleInputChange} name="id" />
        </div>

        <button onClick={logIn} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
