import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
import Router from "next/router";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, username, password, password2 } = formData;
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (isError) {
      console.log("error");
    }

    if (isSuccess || user) {
      Router.push("/");
    }
    dispatch(reset);
  }, [user]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      console.log("Passwords do not match");
      if (username.isError) {
        console.log("Passwords do not match");
      }
    } else {
      const userData = {
        name,
        username,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  return (
    <div className="register__main">
      <div className="register__wrapper">
        <div className="register__left">
          <img className="register__img" src={"/assets/left.png"} alt="" />
        </div>

        <div className="register__inputs">
          <div className="register__text">
            <h1>Sign up</h1>
            <p>
              Welcome to conncevtive create your account and have an instant
              access to the platform
            </p>
          </div>
          <button className="register__google__btn">
            <FcGoogle size={25} /> Sign Up with Google
          </button>
          {/* or line */}

          <form className="main__form" onSubmit={onSubmit}>
            <div className="main__form">
              <p className="mov">Name</p>
              <input
                type="text"
                className="form-control inp"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <p className="mov">Username</p>
              <input
                type="text"
                className="form-control inp"
                id="username"
                name="username"
                value={username}
                placeholder="Enter username"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <p className="mov">Email</p>
              <input
                type="email"
                className="form-control inp"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <p className="mov">Password</p>
              <input
                type="password"
                className="form-control inp"
                id="password"
                name="password"
                value={password}
                placeholder="Enter password"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <p className="mov">Confirm Password</p>
              <input
                type="password"
                className="form-control inp"
                id="password2"
                name="password2"
                value={password2}
                placeholder="Confirm  password"
                onChange={onChange}
              />
            </div>
            <div className="form-btn">
              <button className="btn btn-block">
                <p className="btn__text">Sign up && Create my account</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
