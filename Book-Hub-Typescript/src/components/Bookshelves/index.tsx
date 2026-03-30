import {useEffect , useState} from "react"
import Cookies from "js-cookie"
import './index.css'
import {TailSpin} from 'react-loader-spinner'
import Header from "../Header"
import BookCard from "../BookCard"
import FiltersGroup from "../FiltersGroup"
import Contact from "../Contact"
import type { BookdetailsData } from "../types"
interface Bookshelf{
    _id: string | number
    value: string
    label:string
}

interface ApiResponse{
    status:string,
    data:BookdetailsData[]|null,
    errorMsg:string|null
}
interface ApiBook{
    authorName: string;
    coverPic: string;
    _id: number;
    rating: string;
    readStatus: string;
    title: string;

}

interface BookshelvesProps {
    bookshelvesList: Bookshelf[]
}
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
}

const Bookshelves = (props:BookshelvesProps) => {
    const [apiResponse, setApiResponse] = useState<ApiResponse>({
        status: apiStatusConstants.initial,
        data: null,
        errorMsg: null
    })
    const { bookshelvesList } = props

    const [bookShelfName, setBookShelfName] = useState('ALL')
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
            const url = `http://localhost:4000/books/api/get?shelf=${bookShelfName}&search=${searchText}`
            const options = {
                headers:{
                    Authorization: `Bearer ${jwtToken}`
                },
                method: 'GET'
            };
            const response = await fetch(url,options)
            console.log(response)
            if(response.ok==true){
                const fetchedData = await response.json()
                // console.log(fetchedData)
                const formattedData = fetchedData.books.map((each:ApiBook)=>({
                    authorName: each.authorName,
                    coverPic: each.coverPic,
                    _id: each._id,
                    rating: each.rating,
                    readStatus: each.readStatus,
                    title: each.title
                }))
                console.log(formattedData)
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

        }
        getResponse()
    },[bookShelfName,searchText])
    const renderBooksListView = () => {
        const {data} = apiResponse
        
        return (!data || data.length === 0)?(
            <div className="search-no-container">
                <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752370266/Asset_1_1_palt0z.png" className="search-no"/>
                <p className="search-no-para">Your search did not find any matches.</p>
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
                <ul  className="bookshelves-grid">
                   {data.map((each) => (
                    <BookCard books={{ ...each, readStatus: each.readStatus }} key={each._id}/>
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
    const changeCategory = (value:string) => {
        setBookShelfName(value)
    }
    
    return(
        
            
            <div className="book-shelves-cont">
                <div>
                <Header/>
                </div>
                <div className="flexing">
                <div className="side-cont">
                    <h1 className='heading'>Bookshelves</h1>
                <ul className="filters-list">
                {bookshelvesList.map((each)=>(

                <FiltersGroup 
                        key={each._id}
                        shelf={each}
                        changeCategory={changeCategory}
                        isActive = {each.value==bookShelfName}
                        
                />
                ))}
                </ul>
                </div>
                <div className="render-book-cont">
                    {renderAllBooks()} 
            
                </div>
                
           
            </div>
            <div className="con">
            <Contact/>
            </div>
        </div>
    )


}
export default Bookshelves