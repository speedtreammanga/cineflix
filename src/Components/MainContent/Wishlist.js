import clsx from 'clsx'
import React from 'react'
import { useOutletContext } from 'react-router-dom'
import {FaThumbsUp, FaThumbsDown, FaChevronDown, FaChevronUp, FaChevronRight, FaChevronLeft, FaPlusCircle} from "react-icons/fa"
import {RiCloseCircleFill} from "react-icons/ri"

const IMG_QUALITY = "w500"
const IMG_BASE_URL = `https://image.tmdb.org/t/p/${IMG_QUALITY}`
const VIDEO_BASE_URL = `https://api.themoviedb.org/3/movie`
const API_KEY = "api_key=3a4a44fcbe03abc4f6aa72497ddf7bb0"


export default function Wishlist() {
	const wishlist = JSON.parse(window.localStorage.getItem('wishlist'))	

	const [popMovie, setPopMovie] = React.useState(false)
	const [currentTrailer, setCurrentTrailer] = React.useState(0)
	const [selectedMovie, setSelectedMovie] = React.useState(null)
	const [indexOfSelectedMovie, setIndexOfSelectedMovie] = React.useState(null)
	const [selectedMovieTrailers, setSelectedMovieTrailers] = React.useState(null)
	const [refresh, setRefresh] = React.useState(false)
	let wishlistVideo = React.useRef()
	let popupWindow = React.useRef()
  const [isMobile, setIsMobile, backdropDesktop, setBackdropDesktop, language, setLanguage] = useOutletContext();

	React.useEffect(()=>{
		
		console.log("wishlist:", wishlist)
	}, [])

	React.useEffect(()=>{
		function checkIfClickedOutside(event){
			if(popMovie && !popupWindow.current.contains(event.target)) {
				setPopMovie(false)
			}
		}
		function checkIfPressedEscape(event){
			if(popMovie && event.key == 'Escape') {
				setPopMovie(false)
			}
		}
		document.addEventListener("mousedown", checkIfClickedOutside)
		document.addEventListener("keydown", checkIfPressedEscape)
		
		
		if(!popMovie){
			document.removeEventListener("mousedown", checkIfClickedOutside)
			document.removeEventListener("keydown", checkIfPressedEscape)
			setCurrentTrailer(0)

		}
		return () => {
			console.log("unmounted eventListeners")
			document.removeEventListener("mousedown", checkIfClickedOutside)
			document.removeEventListener("keydown", checkIfPressedEscape)

		}

	}, [popMovie])

	React.useEffect(()=>{
		selectedMovie && popUpMovie(selectedMovie)

		let myWishlist = JSON.parse(window.localStorage.getItem('wishlist'))
		if (myWishlist) {
			for(let i=0; i<myWishlist.length; i++){
				 
				if(selectedMovie){
					if(myWishlist[i].title === selectedMovie.title){
						setIndexOfSelectedMovie(i)
						break;
					}
				}
			}
		}
	}, [selectedMovie])

	React.useEffect(()=>{
		let myWishlist = JSON.parse(window.localStorage.getItem('wishlist'))
		if (myWishlist) {
			setSelectedMovie(myWishlist[indexOfSelectedMovie])
			console.log(indexOfSelectedMovie)
		}

	}, [indexOfSelectedMovie])

	React.useEffect(()=>{
		selectedMovieTrailers &&	console.log("SelectedMovieTrailers length",selectedMovieTrailers.length)
	}, [selectedMovieTrailers])


	React.useEffect(()=>{
		setRefresh(false)
	}, [refresh])



	function removeFromWishlist(clickedMovie){
		const prevWishlist = JSON.parse(window.localStorage.getItem('wishlist'))
		if(window.localStorage.getItem('wishlist').includes(clickedMovie.id)){
			let newWishlist = prevWishlist.filter(movie=>movie.id!==clickedMovie.id);
			window.localStorage.setItem('wishlist', JSON.stringify(newWishlist))
			console.log("removed", clickedMovie.title)
			setRefresh(true)
			setPopMovie(false);
		}
	}


	function minutesToHours(number) {
		let hours = Math.floor(number/60);
		let minutesLeft = number - (hours*60);

		return(`${hours}h ${minutesLeft}m`)
	}

	function textInLanguage(text_eng, text_fr, text_es){
		if(language === "en-US"){
			return text_eng
		}
		else if(language === "fr-FR"){
			return text_fr
		}
		else if(language === "es-SP"){
			return text_es
		}
	}

	async function getTrailers(movie){
		const response = await fetch(`${VIDEO_BASE_URL}/${movie.id}/videos?${API_KEY}&language=${language}`)
		const data = await response.json()

		let trailersForMovie = data.results
		setSelectedMovieTrailers(trailersForMovie)
	}

	function changeTrailer(movie,effect){
		if(effect === "+"){
			if(currentTrailer < selectedMovieTrailers.length - 1)
			setCurrentTrailer(currentTrailer + 1)
		}
		else if(effect === "-"){
			if(currentTrailer > 0){
				setCurrentTrailer(currentTrailer - 1)
			}
		}
	}

	function changeSelectedMovie(effect){
		let myWishlist = JSON.parse(window.localStorage.getItem('wishlist'))
		setCurrentTrailer(0)
		if(effect === "+"){
			if(indexOfSelectedMovie < myWishlist.length-1){
			setIndexOfSelectedMovie(prevState=>prevState+1)
			}
		}
		else if(effect === "-"){
			if(indexOfSelectedMovie > 0){
				setIndexOfSelectedMovie(prevState=>prevState-1)
			}
		}
	}

	function popUpMovie(movie){
			getTrailers(movie)
			setPopMovie(true)
	}

	function selectMovie(movie){
		console.log("selected:", movie.title)
		setSelectedMovie(movie);
	}

	return (
		<div className={clsx({
			"Wishlist":true,
			"Mobile": isMobile
		})}>

			{!wishlist || wishlist.length === 0 ?
				<div>
					<h2>You currently have no movies in your wishlist.</h2>
					<h2>Browse the 'Popular Movies' catalog and add some to your list!</h2>
				</div>
				:
				<div>
					<div className="wishlist--movieList--element">
						{wishlist.map((movie)=>{
							return(
								<div className="wishlist--item" key={`wishlist-item-${movie.title}`}>
									<div className="xButtonContainer" style={{height:16, width:16}}>
										<RiCloseCircleFill className="wishlist--item--xButton" fill="red" onClick={()=>removeFromWishlist(movie)}/>
									</div>
									<div onClick={()=>selectMovie(movie)} >
										<img className="wishlist--item--poster" src={`${IMG_BASE_URL}${movie.poster_path}`} alt="movie poster"/>
										<p className="wishlist--item--title">{movie.title}</p>
									</div>
								</div>
							)
						})}
					</div>
					{popMovie &&
						<div className="wishlist--popupWindow" ref={popupWindow}>
							<div className="wishlist--item--popupContainer">
								<div className={clsx({"wishlist--selectedMovie--Desktop--info":!isMobile, "wishlist--selectedMovie--Mobile--info":isMobile})}>
									
								{selectedMovieTrailers && 	
									<div className={clsx({"wishlist--videoContainer--Desktop":!isMobile, "wishlist--videoContainer--Mobile":isMobile})}>
										
										<div className="wishlist--videoContainer--selectedMovieButtons">
											<button className={indexOfSelectedMovie !== 0? "prevSelectedMovieBtn":"prevSelectedMovieBtn--disabled"} onClick={()=>changeSelectedMovie("-")}>{`<<`}</button>
											<p className="selectedMovieTitle">{selectedMovie.title}</p>
											<button className={indexOfSelectedMovie !== JSON.parse(window.localStorage.getItem('wishlist')).length - 1? "nextSelectedMovieBtn":"nextSelectedMovieBtn--disabled"} onClick={()=>changeSelectedMovie("+")}>{`>>`}</button>
										</div>

										{ (selectedMovieTrailers.length !== 0) &&
										<iframe
										className="wishlist--video"
										src={`https://www.youtube-nocookie.com/embed/${selectedMovieTrailers[currentTrailer].key}?autoplay=1`}
										frameBorder="0"
										allowFullScreen ng-show="showvideo"
										allow="autoplay; encrypted-media"
										title="trailer"
										ref={wishlistVideo}
										onLoad={()=>{console.log("LOADED TRAILER:",wishlistVideo.current)}}
										/>}
										{ (selectedMovieTrailers.length === 0) &&
										<p>No trailers were found for this movie</p>}

										<div className="wishlist--videoContainer--buttons">
											<button onClick={()=>changeTrailer(selectedMovie, "-")} className={currentTrailer>0? "wishlist--prevTrailerBtn--active":"wishlist--prevTrailerBtn--disabled"}>{"<"}</button>
											<p>{`${currentTrailer+1}/${selectedMovieTrailers.length}`}</p>
											<button onClick={()=>changeTrailer(selectedMovie, "+")} className={currentTrailer < (selectedMovieTrailers.length - 1)? "wishlist--nextTrailerBtn--active": "wishlist--nextTrailerBtn--disabled"}>{">"}</button>
										</div>
										
									</div>
									}
									{!selectedMovieTrailers &&
										<p>We didn't find any trailers for this one...</p>
									}
								</div>
							</div>
						</div>
					}
				</div>
			}
		</div>
	)
}
