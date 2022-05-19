import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault(); // it is used to prevent from reloading the page.
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);  // We send data to the backend using axios and newUser is added.
      setError(false);
      setSuccess(true); // when newUser is added and setSuccess is true, it is sended to the db.
    } catch (err) {
      setError(true);
      console.log(newUser)
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>Travelwithme</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} /> {/*Whenever we change the inputs these refs will be changed so we can use it. */}
        <input type="email" placeholder="email" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (          // Using useState hook, if there is success you can show the below one.
          <span className="success">Successfull. You can login now!</span>
        )}
         {error && <span className="failure">Something went wrong!</span>}   {/*Using useState hook, if there is error you can show the below one. */}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}