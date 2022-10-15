import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
import Router from "next/router";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import {useFormik} from 'formik'
import * as Yup from 'yup'



const Register = () => {
 


  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      console.log("error");
    }

    if (isSuccess || user) {
      Router.push("/");
    }
    dispatch(reset);
  }, [user]);


  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      password2: ''
    },
    validationSchema: Yup.object({
     name: Yup.string().required('name is required').min(3, 'name must be 2 characters or longer') ,
     username: Yup.string().required('username is required').min(4, 'username must be 4 characters or longer').max(26, "username cannot be longer than 26 characters") ,
     email: Yup.string().email('invalid email').required('Email Required'),
     password: Yup.string().min(8, 'password must be 8 characters or longer').required('Password Required')
    }),
    onSubmit: (values) => {

    const userData = {
     name: values.name,
     username: values.username,
     email: values.email,
     password: values.password
    }
    dispatch(register(userData))
  
    }

  })

  return (
    <div className="register__main">
      <div className="register__wrapper">

        <div className="register__left">
          <img className="register__img" src={"/assets/left.png"} alt="" />
        </div>

        <div className="register__inputs">
          <div className="register__text">
            <h1 className="register__h1 font">Sign up</h1>
            <p className="register__p font">
              Welcome to conncevtive create your account and have an instant
              access to the platform
            </p>
          </div>
          <button className="register__google__btn font">
            <FcGoogle size={25} /> Sign Up with Google
          </button>
          <h2 className="register__line font">or</h2>

          <form className="main__form" onSubmit={formik.handleSubmit}>
            <div className="main__form">
              <p className="mov font font">Name</p>
              <input
                type="text"
                className="form-control inp"
                id="name"
                name="name"
                placeholder="Enter your name"
                onBlur={formik.handleBlur}
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <div className="main__form">
              <p className="mov font">Username</p>
              <input
                type="text"
                className="form-control inp font"
                id="username"
                name="username"
                placeholder="Enter username"
                onBlur={formik.handleBlur}
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
            <div className="main__form">
              <p className="mov font">Email</p>
              <input
                type="email"
                className="form-control inp font"
                id="email"
                name="email"
                placeholder="Enter your email"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            <div className="main__form">
              <p className="mov font">Password</p>
              <input
                type="password"
                className="form-control inp font"
                id="password"
                name="password"
                placeholder="Enter password"
                onBlur={formik.handleBlur}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </div>
            <div className="main__form">
              <p className="mov font">Confirm Password</p>
              <input
                type="password"
                className="form-control inp font"
                id="password2"
                name="password2"
                placeholder="Confirm  password"
                onBlur={formik.handleBlur}
                value={formik.values.password2}
                onChange={formik.handleChange}
              />
            </div>
            <div className="terms">
              <input type="checkbox" /> I accept the terms & conditions and I have read the privacy policy 
              <p className="font move__p">Already have an account? <a href="/auth/Login">Sign in</a></p>
            </div>
            <div className="form-btn">
              <button className="btn btn-block" type="submit">
                <p className="btn__text font">Sign up & Create my account</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
