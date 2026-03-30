import './index.css'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import Cookies from 'js-cookie'
import { Link, Navigate, useNavigate } from 'react-router'

const Register = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const onChangeUserName = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }
  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onSubmitFailure = (error_msg: string) => setErrorMsg(error_msg)

  const onSubmitSuccess = (jwtToken: string) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 })
    navigate('/', { replace: true })
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const userDetails = { username: userName, password }
    const url = 'http://localhost:4000/books/api/login'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    if (response.ok) onSubmitSuccess(data.jwtToken)
    else onSubmitFailure(data.error_msg)

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) <Navigate to="/" />
  }

  return (
    <div className="register-page">
      <div className="bg-layer"></div>
      <div className="floating-book"></div>
      <div className="form-card">
        <form onSubmit={submitForm}>
          <div className="logo-block">
            <img
              src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752118688/Group_7730_gl7f6c.png"
              className="logo"
              alt="BookVerse Logo"
            />
            <h1 className="title">Create Your BookVerse Account</h1>
          </div>

          <div className="input-group">
            <label>Username*</label>
            <input
              type="text"
              value={userName}
              onChange={onChangeUserName}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password*</label>
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Login
          </button>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <p className="login-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
