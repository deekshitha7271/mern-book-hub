import './index.css'
import { Link } from 'react-router'


interface Book{
    authorName:string, 
    coverPic:string,
    rating:string,
    _id:number,
    readStatus:boolean,
    title:string
}

interface BookCardProps{
    books:Book


}

const BookCard  = (props:BookCardProps):React.ReactElement=> {
    const {books} = props
    const {authorName, coverPic, rating,_id, readStatus, title} = books
    return(
<Link to={`/books/${_id}`}>
  <div className="bookCard cosmic-card">
    <div className="in-img-cont">
      <img src={coverPic} className="in-img cosmic-glow" alt={title} />
    </div>
    <div className="in-des-cont">
      <h1 className="in-title">{title}</h1>
      <p className="in-author">{authorName}</p>
      <p className="in-rating">
        ⭐ {rating} <span className="rating-text">avg rating</span>
      </p>
      <p className="in-status">
        Status: <span className='in-status-value'>
          {readStatus ? "Read" : "To Read"}
        </span>
      </p>
    </div>
  </div>
</Link>

    )

}
export default BookCard