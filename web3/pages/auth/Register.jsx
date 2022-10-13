import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
import Router from 'next/router'

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
      toast.error(message);
    }

    if (isSuccess || user) {
      Router.push('/')
    }
    dispatch(reset);
  }, [user]);


  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast("Passwords do not match");
      if(username.isError) {
        toast("Passwords do not match");

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
    <section className="main__section">
    <div className="div__color">
        <div className="main__text">
          <h2 className="main__h2">Create an account</h2>
          <p className="main__p">Let's see what other people are doing.</p>
        </div>
        <section className="main__input">
          <form className="main__form" onSubmit={onSubmit}>
            <div className="main__form">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={username}
                placeholder="Enter username"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                placeholder="Enter password"
                onChange={onChange}
              />
            </div>
            <div className="main__form">
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                value={password2}
                placeholder="Confirm  password"
                onChange={onChange}
              />
            </div>
            <div className="form-btn">
            <button className='btn btn-block'>
            submit
            </button>
          </div>
          </form>
          <div className="link">
          <p>Do you have an account ? <a className="main__a" href="/auth/login">Login</a></p>
          </div>
        </section>
    </div>
      </section>
  ) 
};

export default Register;
