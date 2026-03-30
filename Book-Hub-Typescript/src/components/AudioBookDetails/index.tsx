import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Cookies from "js-cookie"
import { TailSpin } from 'react-loader-spinner'
import Header from "../Header"
import Contact from "../Contact"
import './index.css'

interface ApiBook {
  authorName: string;
  coverPic: string;
  _id: string;
  title: string;
  audio: string[];
}

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS'
}

const AudioBookDetails = () => {
  const { id } = useParams()
  const [apiResponse, setApiResponse] = useState<{status: string; data: ApiBook | null; errorMsg: string | null}>({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null
  })

  useEffect(() => {
    const getBookDetails = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })

      const jwtToken = Cookies.get('jwt_token')
      // Instead of /books/api/get/audio/:id (which might skip streaming or details), the user's backend has ALL audiobooks at /get/audio and streams at /stream/audio/:id. The user doesn't have an explicit AudioBookDetails API returning a single book except by grabbing the whole list or using the generic /get/:id. Oh wait! /get/:id will fail because it looks in BookModel, not AudioBookModel! 
      // To work around this quickly, we will fetch ALL audiobooks and filter the one we need by ID.
      const url = `http://localhost:4000/books/api/get/audio`
      const options = {
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: 'GET'
      }

      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const fetchedData = await response.json()
          const dataArray = Array.isArray(fetchedData) ? fetchedData : []
          const foundBook = dataArray.find((b: any) => b._id === id)

          if (foundBook) {
            setApiResponse(prev => ({
              ...prev,
              data: {
                ...foundBook,
                audio: foundBook.audio || []
              },
              status: apiStatusConstants.success
            }))
          } else {
            setApiResponse(prev => ({ ...prev, status: apiStatusConstants.failure }))
          }
        } else {
          setApiResponse(prev => ({ ...prev, status: apiStatusConstants.failure }))
        }
      } catch (error) {
        console.error(error)
        setApiResponse(prev => ({ ...prev, status: apiStatusConstants.failure }))
      }
    }
    getBookDetails()
  }, [id])

  const renderSuccessView = () => {
    const { data } = apiResponse
    if (!data) return null;

    return (
      <div className="audio-details-wrapper">
        <div className="spotify-hero-banner">
          <img src={data.coverPic} alt={data.title} className="spotify-hero-image" />
          <div className="spotify-hero-text">
            <span className="spotify-eyebrow">Audiobook Playlist</span>
            <h1 className="spotify-hero-title">{data.title}</h1>
            <p className="spotify-hero-author">By {data.authorName}</p>
            <p className="spotify-hero-stats">{data.audio.length} {data.audio.length === 1 ? 'Track' : 'Tracks'}</p>
          </div>
        </div>

        <div className="spotify-tracks-container">
          {data.audio.length > 0 ? (
            <ul className="spotify-tracklist">
              {data.audio.map((trackUrl, index) => {
                // Determine a track name from URL natively, or just label as Track 1, 2, etc.
                const fallbackName = `Audio Track ${index + 1}`
                return (
                  <li key={index} className="spotify-track-row">
                    <div className="track-index">{index + 1}</div>
                    <div className="track-info">
                      <span className="track-name">{fallbackName}</span>
                      <span className="track-artist">{data.authorName}</span>
                    </div>
                    <div className="track-player">
                      <audio controls controlsList="nodownload" className="native-track-player">
                        <source src={trackUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="no-tracks-found">
              <h2>No audio tracks available for this book.</h2>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (apiResponse.status) {
      case apiStatusConstants.inProgress:
        return (
          <div className="load" style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TailSpin height={50} width={50} color="#1ed760" />
          </div>
        )
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
      default:
        return (
          <div className="load" style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img src="https://res.cloudinary.com/dqxhjnhrt/image/upload/v1752372175/Group_7522_iwvq1j.png" alt="failure" className="went-wrong-img" />
            <h1 className="went-wrong-head">Failed to load Audiobook Details.</h1>
          </div>
        )
    }
  }

  return (
    <div className="audio-shelves-cont">
      <Header />
      <div className="audio-details-container">
        {renderContent()}
      </div>
      <Contact />
    </div>
  )
}

export default AudioBookDetails
