// import './index.css'
// import { useState} from 'react'
// import type { ChangeEvent } from 'react'
// import Cookies from 'js-cookie'
// import { Navigate, useNavigate } from 'react-router'
// const Login = () => {
//   const [userName, setUserName] = useState('')
//   const [password, setPassword] = useState('')
//   const [errorMsg, setErrorMsg] = useState('')
//   const navigate = useNavigate()
//   const onChangeUserName = (event:ChangeEvent<HTMLInputElement>) => {
//     setUserName(event.target.value)
//   }
//   const onChangePassword = (event:ChangeEvent<HTMLInputElement>) =>{
//     setPassword(event.target.value)
//   }
//   const onSubmitFailure = (error_msg:string) =>{
//     setErrorMsg(error_msg)

//   }
  
//   const onSubmitSuccess = (jwtToken:string) => {
//     Cookies.set('jwt_token', jwtToken, {expires:30})
//     navigate('/', {replace:true})
//   }
//   const submitForm = async (event:React.FormEvent<HTMLFormElement>)  => {
//     event.preventDefault()
//     const userDetails = {username:userName, password:password}
//     const url = 'http://localhost:4000/books/api/register'
//     const options={
//       method: 'POST',
      
//   headers: {
    
//     'Content-Type': 'application/json',
//   },
//       body: JSON.stringify(userDetails)
//     }
//     const response = await fetch(url, options)
//         const text = await response.text();
//     const data = text ? JSON.parse(text) : {};


//     // console.log(data)
//     if(response.ok===true){
          

//       onSubmitSuccess(data.jwt_token)
//     }
//     else{
      
//       onSubmitFailure(data.error_msg)
//     }
//     const jwtToken = Cookies.get('jwt_token')
//     if(jwtToken!==undefined){
//       <Navigate to="/"/>

//     }
    


//   }
//   return (
//     <div className="login-block">
//       <div className="image-block">
//         <img
//           src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752118249/Rectangle_1467_1_rmereb.png"
//           className="form-img"
//         />
//       </div>
//       <div className="login-inner">
//         <form className='form' onSubmit={submitForm}>
//           {/* <div> */}
//           <div className="heading-cont">
//             <img
//               src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752118688/Group_7730_gl7f6c.png"
//               className="logo-img"
//             />
//             <h1 className="main-h">ook Hub</h1>
//           </div>
//           <div className='username-div'>
//           <label htmlFor="userName*" className="userName-label">
//             Username*
//           </label>
//           <input id="userName" className="userName-input" onChange={onChangeUserName} value={userName}></input>
//           </div>
//           <div className='password-div'>
//           <label htmlFor="passWord" className="password-label">
//             Password*
//           </label>
//           <input id="password" className="password-input" onChange={onChangePassword} value={password}  type="password"></input>
//           </div>
//           <button className='login-button'>login</button>
//           {/* </div> */}
//           <p>{errorMsg}</p>
//         </form>
//       </div>
//     </div>
//   )
// }
// export default Login


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
    const url = 'http://localhost:4000/books/api/register'
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
            Register
          </button>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
