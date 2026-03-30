import {useEffect , useState} from "react"
import { Link } from "react-router"
import Cookies from "js-cookie"
import './index.css'
import {TailSpin} from 'react-loader-spinner'
import Header from "../Header"
import Contact from "../Contact"

interface ApiResponse{
    status:string,
    data:ApiBook[]|null,
    errorMsg:string|null
}
interface ApiBook{
    authorName: string;
    coverPic: string;
    _id: number;
    title: string;
    audio: string[];
}

// interface BookshelvesProps {
//     bookshelvesList: Bookshelf[]
// }
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
}

const AudioBookshelves = () => {
    const [apiResponse, setApiResponse] = useState<ApiResponse>({
        status: apiStatusConstants.initial,
        data: null,
        errorMsg: null
    })
    const [searchText, setSearchText] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const onChangeSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value)
    }
    const onSearchKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    setSearchText(searchInput.toLowerCase()) 
  }
}

    useEffect(()=>{
        const getResponse = async () =>{
            setApiResponse({
                    status: apiStatusConstants.inProgress,
                    data: null,
                    errorMsg: null,
                })

            const jwtToken = Cookies.get('jwt_token')
            const url = `http://localhost:4000/books/api/get/audio`
            const options = {
                headers:{
                    Authorization: `Bearer ${jwtToken}`
                    

                },
                method: 'GET'
            };
            try {
                const response = await fetch(url,options)
                if (response.ok) {
                    const fetchedData = await response.json()
                    
                    const dataArray = Array.isArray(fetchedData) ? fetchedData : [];
                    
                    const formattedData = dataArray.map((each:ApiBook)=>({
                        authorName: each.authorName,
                        coverPic: each.coverPic,
                        _id: each._id,
                        title: each.title,
                        audio: each.audio || []
                    }))
                    setApiResponse(prev=>({
                        ...prev,
                        data: formattedData,
                        status:apiStatusConstants.success
                    }))
                    setSearchInput('')
                }
                else{
                    setApiResponse(prev=>({
                      ...prev,
                      status: apiStatusConstants.failure  
                    }))
                }
            } catch (error) {
                console.error("API fetching error:", error)
                setApiResponse(prev=>({
                    ...prev,
                    status: apiStatusConstants.failure  
                }))
            }

        }
        getResponse()
    },[searchText])
    const renderBooksListView = () => {
        const {data} = apiResponse
        
        return (!data || data.length === 0)?(
            <div className="search-no-container">
                <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752370266/Asset_1_1_palt0z.png" className="search-no"/>
                <p className="search-no-para">Your search for {searchText} did not find any matches.</p>
            </div>
        ):
        (<div className="bookshelves-cont">
                
                <div className="top-div">
                    <h1 className="main-head">All Books</h1>
                    <div className="search-div">
  <input
    placeholder="Search for books..."
    className="search-input"
    onChange={onChangeSearch}
    value={searchInput}
    onKeyDown={onSearchKeyDown}
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="search-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a855f7"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
</div>

                </div>
                <ul className="audiobooks-grid">
                   {data.map((each) => (
                    <Link to={`/audiobooks/${each._id}`} className="audio-card-link" key={each._id}>
                        <li className="spotify-card">
                            <div className="spotify-cover-wrapper">
                                <img src={each.coverPic} alt={each.title} className="spotify-cover" />
                                <div className="spotify-play-btn">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                            <h2 className="spotify-title">{each.title}</h2>
                            <p className="spotify-author">{each.authorName}</p>
                        </li>
                    </Link>
                   ))}
                </ul>
            </div>
        )
    }
    const renderLoadingView = ():React.ReactElement => {
        return(
            <div className="load">
            
            <div className="loader-container" data-testid="loader">
                <TailSpin height={50} width={50} color="#0284C7" />
            </div>
            </div>)

    }
    const renderFailureView = () :React.ReactElement => {
        return(
        <div>
            <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752372175/Group_7522_iwvq1j.png" className="went-wrong-img"/>
            <h1 className="went-wrong-head">Something went wrong, Please try again.</h1>
            <button className="went-wrong-button">Try Again</button>
        </div>)
    }
    const renderAllBooks = ()  => {
        const {status} = apiResponse
        switch(status){
            case apiStatusConstants.success:
                return renderBooksListView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            default:
                return null
            
        }
    }
    // const changeCategory = (value:string) => {
    //     setBookShelfName(value)
    // }
    return(
        
            
            <div className="audio-shelves-cont">
                <div>
                <Header/>
                </div>
                <div className="audio-flexing">
                
                <div className="audio-render-cont">
                    {renderAllBooks()} 
            
                </div>
                
           
            </div>
            <div className="con">
            <Contact/>
            </div>
        </div>
    )


}
export default AudioBookshelves