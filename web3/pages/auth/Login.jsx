import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../../features/auth/authSlice";
import Router from 'next/router'
import { FcGoogle } from "react-icons/fc";
import {useFormik} from 'formik'
import * as Yup from 'yup'


//show error messages propertly: 
// password is too short, don't match, 

const Login = () => {
 const [error, setError] = useState(false)
 const [pass, setpass] = useState(false)

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
     const dispatch = useDispatch()

  const wrongEmail = 'Request failed with status code 400'
  const wrongPass = 'Request failed with status code 402'


     useEffect(() => {

      if(isError && message ===  wrongEmail) {
      setError(true)
      }
      if(isError && message ===  wrongPass) {
        setpass(true)
        }

      if (isSuccess || user) {
        setError(false)
          Router.push('/')
      }
  
      dispatch(reset())
    }, [user, isSuccess, message])
    

    

      const formik = useFormik({
        initialValues: {
          email: '',
          password: ''
        },
        validationSchema: Yup.object({
         email: Yup.string().email('invalid email').required('Email Required'),
         password: Yup.string().min(8, 'password must be 8 characters or longer').required('Password Required')
        }),
        onSubmit: (values) => {

        const userData = {
         email: values.email,
         password: values.password
        }
        dispatch(login(userData))
      
        }

      })

  return (
    <div className="register__main">
      <div className="register__wrapper">
      
        <div className="register__left">
          <img className="register__img" src={"/assets/left.png"} alt="" />
        </div>

        <div className="register__inputs move__text">
          <div className="register__text login__move">
            <h1 className="register__h1 font">Sign in</h1>
            <p className="register__p font">
                Welcome back! Sign in with the data you have registered with.
            </p>
          </div>
          <button className="register__google__btn font">
            <FcGoogle size={25} /> Sign in with Google
          </button>
          <h2 className="register__line font">or</h2>
          {error === true && <p>Wrong email</p>}
          {pass === true && <p>Wrong PassWord</p>}

          <form className="main__form" onSubmit={formik.handleSubmit}>
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
              {formik.touched.email && formik.errors.email ? <p>{formik.errors.email}</p> : ''}
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
              {formik.touched.password && formik.errors.password ? <p>{formik.errors.password}</p> : ''}
            </div>
            <div className="terms">
              <input type="checkbox" /> Remember Information
              <p className="font move__p">Don't have an account ? <a href="/auth/Register">Sign up</a></p>
            </div>
            <div className="form-btn">
              <button className="btn btn-block" type="submit">
                <p className="btn__text font">Sign in</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login