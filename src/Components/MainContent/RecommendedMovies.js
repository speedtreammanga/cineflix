import React from 'react'
import clsx from 'clsx'
import {FaThumbsUp, FaThumbsDown, FaChevronDown, FaChevronUp, FaChevronRight, FaChevronLeft, FaPlusCircle} from "react-icons/fa"
import {ImCheckmark} from "react-icons/im"
import { useOutletContext } from 'react-router-dom'

	const API_KEY = "api_key=3a4a44fcbe03abc4f6aa72497ddf7bb0"
	const BASE_URL = "https://api.themoviedb.org/3"
	const IMG_BASE_URL = "https://image.tmdb.org/t/p/original"
	const IMG_BASE_URL_MOBILE = "https://image.tmdb.org/t/p/w185"
	const IMG_BASE_URL_DESKTOP = "https://image.tmdb.org/t/p/w342"
	const SELECTED_IMAGE_DESKTOP = "https://image.tmdb.org/t/p/w780"
	const SELECTED_IMAGE_MOBILE = "https://image.tmdb.org/t/p/w342"

export default function RecommendedMovies(props) {
	const [currentPage, setCurrentPage] = React.useState(1)
	const [currentTrailer, setCurrentTrailer] = React.useState(0)
	const [sortBy, setSortBy] = React.useState("popularity.desc")
	const [movies, setMovies] = React.useState(null)
	const [totalPages, setTotalPages] = React.useState(null)
	const [selectedMovie, setSelectedMovie] = React.useState(null)
	const [selectedMovieActors, setSelectedMovieActors] = React.useState(null)
	const [selectedMovieDirectors, setSelectedMovieDirectors] = React.useState(null)
	const [showMoreActors, setShowMoreActors] = React.useState(false)
	const [isLoading, setIsLoading] = React.useState(false)
	const [popTrailer, setPopTrailer] = React.useState(false)
	const [refresh, setRefresh] = React.useState(false)

	const [didMount, setDidMount] = React.useState(false)

  const [isMobile, setIsMobile, backdropDesktop, setBackdropDesktop, language, setLanguage] = useOutletContext();

	const isFirstRender = React.useRef(true);
	const isSecondRender = React.useRef(false);
	const videoContainerRef = React.useRef();
	const watchTrailerBTN = React.useRef();
	const video = React.useRef();
	
	

	React.useEffect(()=>{
		scrollToTop();
		console.log("language changed!")
		selectedMovie && getMovieInfo(selectedMovie.id)
	}, [language])



  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
			isSecondRender.current = true;
			console.log("first render: MOVIES=", movies)  
      return; // 👈️ return early if initial render
    }

		if(isSecondRender.current && movies){
			console.log('state updated: MOVIES= ', movies);
			getMovieInfo(movies[0].id)
			console.log("selectedMovie by default =", movies[0].title)
			getActorsInMovie(movies[0].id)
			isSecondRender.current = false;
			return;
		}
			setIsLoading(false)  
		
		setShowMoreActors(false)
		
  }, [movies]); // 👈️ add state variables you want to track

	React.useEffect(()=>{
		
		if(!isMobile){

		} 
		

	},[isMobile])

		React.useEffect(()=>{
			selectedMovie && console.log(selectedMovie.title);
			setShowMoreActors(false);
			if(selectedMovie){
				setBackdropDesktop(`url(${IMG_BASE_URL}${selectedMovie.backdrop_path})`)
			}
		}, [selectedMovie])
	
		React.useEffect(()=>{
			getPopularMovies();

		}, [currentPage])


		React.useEffect(()=>{
			function checkIfClickedOutside(event){
				console.log(event.target)
				if(popTrailer && videoContainerRef.current && !videoContainerRef.current.contains(event.target)) {
					setPopTrailer(false)
				}
			}
			function checkIfPressedEscape(event){
				console.log(event.target)
				if(popTrailer && event.key == 'Escape') {
					setPopTrailer(false)
				}
			}
			document.addEventListener("mousedown", checkIfClickedOutside)
			document.addEventListener("keydown", checkIfPressedEscape)
			
			
			if(!popTrailer){
				document.removeEventListener("mousedown", checkIfClickedOutside)
				document.removeEventListener("keydown", checkIfPressedEscape)
				setCurrentTrailer(0)

			}
			return () => {
				console.log("unmounted eventListeners")
				document.removeEventListener("mousedown", checkIfClickedOutside)
				document.removeEventListener("keydown", checkIfPressedEscape)
			}

		}, [popTrailer])



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

	function playTrailer(e){
		watchTrailerBTN.current.blur();
		scrollToTop();
		setPopTrailer(true)
	}


	function addToWishlist(){
		const prevWishlist = JSON.parse(window.localStorage.getItem('wishlist'))
		if(prevWishlist !== null && !window.localStorage.getItem('wishlist').includes(selectedMovie.id)) {
			window.localStorage.setItem('wishlist', JSON.stringify([...prevWishlist, selectedMovie]))
			console.log(window.localStorage.getItem('wishlist'))
			setRefresh(!refresh)
		} 
		else if(prevWishlist == null) {
			window.localStorage.setItem('wishlist', JSON.stringify([selectedMovie]))
			console.log(window.localStorage.getItem('wishlist'))
			setRefresh(!refresh)
		}
		else if(window.localStorage.getItem('wishlist').includes(selectedMovie.id)){
			let newWishlist = prevWishlist.filter(movie=>movie.id!==selectedMovie.id);
			window.localStorage.setItem('wishlist', JSON.stringify(newWishlist))
			console.log("removed", selectedMovie.title)
			setRefresh(!refresh)
		}
	}


	function scrollToTop(){
		window.scrollTo({
			top: 60, //60px to not see the navbar
			behavior: 'smooth'
		}) 
		if(!isMobile){
			document.getElementById("RecommendedMovies--Desktop--selectedMovie") && document.getElementById("RecommendedMovies--Desktop--selectedMovie").scrollTo({
				top:0,
				behavior:"smooth"
			});
		}
	}

	function scrollToFirstRecommendedMovie() {
		document.getElementById("RecommendedMovies--movieList").scrollTo({
			left: -9999, 
			behavior: 'smooth'
		}) 
	//	window.scrollBy(0, window.innerHeight);
	}

	function nextPage(){
		setIsLoading(true)

		scrollToFirstRecommendedMovie()
			if(currentPage !== totalPages){
			 return setCurrentPage(currentPage+1)
			}
	}

	function prevPage() {
		setIsLoading(true)
		scrollToFirstRecommendedMovie()
		if(currentPage > 1){
			return setCurrentPage(currentPage-1)
		}

	}



	function minutesToHours(number) {
		let hours = Math.floor(number/60);
		let minutesLeft = number - (hours*60);

		return(`${hours}h ${minutesLeft}m`)
	}

	function selectMovie(movieID) {
		getMovieInfo(movieID)
		getActorsInMovie(movieID)
	}

	async function getMovieInfo(movieID){
		const response = await fetch(`${BASE_URL}/movie/${movieID}?${API_KEY}&language=${language}&append_to_response=videos`)
		const movie = await response.json();

		setSelectedMovie(movie)
	}

	async function getActorsInMovie(movieID) {
		const response = await fetch(`${BASE_URL}/movie/${movieID}/credits?${API_KEY}&language=${language}`)
		const data = await response.json();

		let actors = data.cast;
		let directors = data.crew

		actors.sort((a, b) => {
			return b.popularity - a.popularity;
		});
		directors = directors.filter(person => person.department === 'Directing');
		setSelectedMovieDirectors(directors)
		setSelectedMovieActors(actors)		
		
	}

	async function getPopularMovies() {
		const response = await fetch(`${BASE_URL}/discover/movie?${API_KEY}&sort_by=popularity.desc&page=${currentPage}`)
		const PopularMovies = await response.json();
		setMovies(PopularMovies.results)
		setTotalPages(PopularMovies.total_pages)
	}

	function redirectToMovieWebsite(movie){
		movie.homepage &&	window.open(movie.homepage);
	}
	
	return (
		<main className={clsx({"RecommendedMovies--Desktop":!isMobile, "RecommendedMovies--Mobile":isMobile})} >
			{ selectedMovie &&
				<div className={clsx({"RecommendedMovies--Desktop--selectedMovie":!isMobile, "RecommendedMovies--Mobile--selectedMovie":isMobile})} id="RecommendedMovies--Desktop--selectedMovie">
				{!isMobile && <div className="backdrop--vignette"></div>}
					<img className={clsx({"selectedMovie--poster--Desktop":!isMobile,"selectedMovie--poster--Mobile":isMobile})} src={`${!isMobile? SELECTED_IMAGE_DESKTOP:SELECTED_IMAGE_MOBILE}${selectedMovie.poster_path}`} alt={`movie poster of ${selectedMovie.title}`}/>

				
				<div className={clsx({"selectedMovie--Desktop--info":!isMobile, "selectedMovie--Mobile--info":isMobile})}>
					<h3 className="info--title">{selectedMovie.title}</h3>
					<div className="info--stats">
						<p className="stats--note">{(selectedMovie.vote_average * 10).toFixed(0)}% <FaThumbsUp fill="greenyellow"/> | {((10-selectedMovie.vote_average) *10).toFixed(0)}% <FaThumbsDown fill="indianred"/></p>
						<p className="stats--reviewCount">({selectedMovie.vote_count} {textInLanguage("reviews", "avis", "reseña")} )</p>
						<p className="stats--date"><strong>{textInLanguage("Release","Date de sortie", "Estreno")}:</strong> {selectedMovie.release_date}</p>
						<p className="stats--runtime"><strong>{textInLanguage("Runtime", "Durée", "Tiempo de ejecución")}:</strong> {minutesToHours(selectedMovie.runtime)}</p>
					</div>
					<p className="info--overview">
						{selectedMovie.overview}
					</p>
					<div className="info--tags">
						<p className="tags--genre">
							<em>{textInLanguage("GENRE", "CATÉGORIE", "GÉNERO")}:</em> {selectedMovie.genres.map((genre,genreIndex)=>
								(genreIndex >= selectedMovie.genres.length-1)? `${genre.name}`: `${genre.name}, `
							)}
						</p>
						{ selectedMovieActors &&
						<p className="tags--actors"><em>{textInLanguage("STARRING", "ACTEURS", "PROTAGONIZADA")}:</em> {selectedMovieActors.map((actor,actorIndex)=>{
							
							if(!showMoreActors){
								if(actorIndex >=4){return;}else{
									return((actorIndex >= 3)? `${actor.name} ${textInLanguage("and", "et", "y")} ${selectedMovieActors.length - 4} ${textInLanguage("others", "autres", "otros")}...` : `${actor.name}, `)
								}	
							} else{
								return((actorIndex >= selectedMovieActors.length-1)? `${actor.name}` : `${actor.name}, `)

							}
							
						}
						)}
						</p>
						}
						{ 
							<button className="expand-actor-list" onClick={()=>setShowMoreActors(!showMoreActors)}>{showMoreActors? <FaChevronUp/> :  <FaChevronDown/>}</button>
						}
						{ selectedMovieDirectors &&
						<p className="tags--directors">{textInLanguage("DIRECTED BY", "RÉALISÉ PAR", "DIRIGIDO POR")}: {selectedMovieDirectors.map((director,directorIndex)=>
								(directorIndex >= selectedMovieDirectors.length-1)? `${director.name}` : `${director.name}, `
						)}
						</p>
						}
					</div>
					
					<div className="info--buttons">
						{selectedMovie.homepage &&
						<button className="buttons--visitWebsite" onClick={()=>redirectToMovieWebsite(selectedMovie)}>{textInLanguage("Watch now", "Regarder maintenant", "Ver ahora")}</button>
						}
						<button className="buttons--wishlist" onClick={addToWishlist}>
							{(window.localStorage.getItem('wishlist') && window.localStorage.getItem('wishlist').includes(selectedMovie.id))
							?
							<ImCheckmark/>
							:
							<FaPlusCircle/>}
							{(window.localStorage.getItem('wishlist') && window.localStorage.getItem('wishlist').includes(selectedMovie.id))
							? 
							(textInLanguage("ADDED TO LIST", "INCLUS DANS VOTRE LISTE","AÑADIDO A TU LISTA")) 
							: 
							textInLanguage("ADD TO WISHLIST", "AJOUTER À MA LISTE", "AÑADIR A MI LISTA")}
						</button>
						{selectedMovie.videos.results.length>0 && 
						 <button className="buttons--watchTrailer" ref={watchTrailerBTN} onClick={(e)=>playTrailer(e)}>{textInLanguage("Watch Trailer", "Voir bande annonce", "Ver el trailer")}</button>
						}
					</div>

					<div className="info--trailer">
						
						{popTrailer &&
						 <div className="popupWindow">
							<div className={clsx({"videoContainer--Desktop":!isMobile, "videoContainer--Mobile":isMobile})} ref={videoContainerRef}>
							<button onClick={()=>setCurrentTrailer(currentTrailer-1)}>{"<"}</button>
							<button onClick={()=>setCurrentTrailer(currentTrailer+1)}>{">"}</button>
							<iframe
							className="video"
							src={`https://www.youtube-nocookie.com/embed/${selectedMovie.videos.results[currentTrailer].key}?autoplay=1`}
							frameBorder="0"
							allowFullScreen ng-show="showvideo"
							allow="autoplay; encrypted-media"
							title="trailer"
							ref={video}
							onLoad={()=>{console.log(video.current)}}
					 		/>
						 </div>
						 </div>
						}
					</div>
				</div>
			</div>
			}
			<div className="RecommendedMovies--Element">
				<p className={clsx({"recommended-movies-title--Desktop":!isMobile, "recommended-movies-title--Mobile":isMobile})}>{textInLanguage("RECOMMENDED MOVIES", "FILMS RECOMMANDÉS", "PELICULAS RECOMENDADAS")}:</p>
				{ movies !== null &&
				<div id="RecommendedMovies--movieList" className="RecommendedMovies--movieList">
				{	movies.map((movie,movieIndex) =>{
						return(
							<div className={clsx({"RecommendedMovies--movieElement--Desktop":!isMobile, "RecommendedMovies--movieElement--Mobile":isMobile})} onClick={scrollToTop} key={`movie#${movieIndex}`}>
								{!isLoading && <img className={clsx({"movieElement--poster--Desktop":!isMobile, "movieElement--poster--Mobile":isMobile})} src={`${!isMobile? IMG_BASE_URL_DESKTOP:IMG_BASE_URL_MOBILE}${movie.poster_path}`} alt={`movie poster for ${movie.title}`} onClick={()=>selectMovie(movie.id)}/>}
							</div>
						)
					})
				}
				</div>
				}
			</div>

			{ selectedMovie == null &&
				<p>loading...</p>
			}
			{ movies == null &&
				<p>Loading</p>
			}

			{movies && 
				<div className="changeMoviePagesButton">
					<button className="button--prevPage" onClick={prevPage}><FaChevronLeft/></button>
					<p className="pagenumberNumber">{currentPage}</p>
					<p className="pagenumberSpace"> / </p>
					<p className="pagenumberNumber">{totalPages}</p>
					<button className="button--nextPage" onClick={nextPage}><FaChevronRight/></button>
				</div>
			}
		</main>
	)
}
