import './index.css'
import { NavLink , useNavigate } from 'react-router'
import Cookies from 'js-cookie'

const Header = () => {
  const navigate = useNavigate();

  const onClickLogOut = () => {
    Cookies.remove('jwt_token')
    navigate("/login", {replace:true})
  }

  return(
    <nav className='header-div'>
      <NavLink to="/" end className="logo-link">
    <div className="heading-cont">
        <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1761669311/Screenshot_2025-10-28_220405_oukx91.png"className="logo-img"/>
        <h1 className="main-h">ook Hub</h1>
    </div>
    </NavLink>
    <div className='hamburger-menu'>
      
    </div>
    <div className='link-cont'>
      <NavLink to="/" end className={({ isActive }) => isActive ? 'Active nav-item' : 'notIsActive nav-item'}>Home</NavLink>
      <NavLink to="/bookshelves" className={({ isActive }) => isActive ? 'Active nav-item' : 'notIsActive nav-item'}>Bookshelves</NavLink>
      <NavLink to="/audiobooks" className={({ isActive }) => isActive ? 'Active nav-item' : 'notIsActive nav-item'}>Audiobooks</NavLink>
      <div className='b-cont'>
      <button className='logout' onClick={onClickLogOut}>Logout</button>
      </div>
    </div>
    
    </nav>
    )
}
export default Header