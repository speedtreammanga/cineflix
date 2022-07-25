import React from 'react'
import clsx from 'clsx'
import {FaThumbsUp, FaThumbsDown, FaChevronDown, FaChevronUp, FaChevronRight, FaChevronLeft} from "react-icons/fa"
import { useOutletContext } from 'react-router-dom'

	const API_KEY = "api_key=3a4a44fcbe03abc4f6aa72497ddf7bb0"
	const BASE_URL = "https://api.themoviedb.org/3"
	const IMG_BASE_URL = "https://image.tmdb.org/t/p/original"

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

	const [language, setLanguage] = React.useState("en-US")
	const [didMount, setDidMount] = React.useState(false)

  const [isMobile, setIsMobile, backdropDesktop, setBackdropDesktop] = useOutletContext();
	
	const localStorageMovies = JSON.parse(window.localStorage.getItem('movies'))
	const localStorageSelectedMovie = JSON.parse(window.localStorage.getItem('selectedMovie'))
	const localStorageSelectedMovieActors = JSON.parse(window.localStorage.getItem('selectedMovieActors'))
	const localStorageSelectedMovieDirectors = JSON.parse(window.localStorage.getItem('selectedMovieDirectors'))
	const localStorageCurrentPage = JSON.parse(window.localStorage.getItem('currentPage'))


	const isFirstRender = React.useRef(true);
	const isSecondRender = React.useRef(false);
	


  React.useEffect(() => {
    if (isFirstRender.current) {
			console.log("--------------------- FIRST RENDER -----------------------")
      isFirstRender.current = false;
			isSecondRender.current = true;
			console.log("first render: MOVIES=", movies)
			if(localStorageMovies == null) {
				window.localStorage.setItem('movies', JSON.stringify(movies));
				console.log("movies == null so setMovies pipi caca", movies)
			}
			console.log(localStorageMovies) && setMovies(localStorageMovies)
			console.log(localStorageSelectedMovie) && setSelectedMovie(localStorageSelectedMovie)
			console.log(localStorageSelectedMovieActors) && setSelectedMovieActors(localStorageSelectedMovieActors)
			console.log(localStorageSelectedMovieDirectors) && setSelectedMovieDirectors(localStorageSelectedMovieDirectors)
			console.log(localStorageCurrentPage) && setCurrentPage(localStorageCurrentPage)
			console.log("--------------------- END -----------------------")

      return; // 👈️ return early if initial render
    }

		if(isSecondRender.current && movies){
			console.log("--------------------- SECOND RENDER -----------------------")

			console.log('state updated: MOVIES= ', movies);
			console.log("IS THIS NULL OR WHAT THE FUCK?",localStorageSelectedMovie)
			if(localStorageSelectedMovie !== null){
				setSelectedMovie(localStorageSelectedMovie)
				console.log("selectedMovie from localStorage,", localStorageSelectedMovie.title)
			} else if(localStorageSelectedMovie === null){
				getMovieInfo(movies[0].id)
				console.log("selectedMovie by default =", movies[0].title)
			}  

			if(localStorageSelectedMovieActors !== null && selectedMovieActors == null){
				setSelectedMovieActors(localStorageSelectedMovieActors) 
				setSelectedMovieDirectors(localStorageSelectedMovieDirectors) 
				console.log("LOADING ACTORS AND DIRECTORS!!", localStorageSelectedMovieActors)
			} else{
				getActorsInMovie(movies[0].id)
			}
			isSecondRender.current = false;
			console.log("--------------------- END -----------------------")
			return;
		}

		console.log("--------------------- THIRD RENDER -----------------------")
		
		setShowMoreActors(false)
		window.localStorage.setItem('movies', JSON.stringify(movies));
		localStorageSelectedMovie && console.log("selectedMovie by LocalStorage =", localStorageSelectedMovie.title)
		console.log("--------------------- END -----------------------")

  }, [movies]); // 👈️ add state variables you want to track

		React.useEffect(()=>{
			console.log("useEffect selectedMovie triggered")
			if(localStorageSelectedMovie !== null && selectedMovie !== null){
				console.log("scenario #1")
			}
			else if(localStorageSelectedMovie !== null && selectedMovie === null){
				console.log("scenario #1")
				console.log("loading selectedMovie with localStorage:", localStorageSelectedMovie)
				setSelectedMovie(localStorageSelectedMovie)
			}
			else if(localStorageSelectedMovie == null && selectedMovie !== null){
				console.log("scenario #3")

			}
			else if(localStorageSelectedMovie == null && selectedMovie == null){
				console.log("scenario #4")

			}

			selectedMovie && console.log("currently selectedMovie",selectedMovie.title);
			setShowMoreActors(false);
			selectedMovie && setBackdropDesktop(`url(${IMG_BASE_URL}${selectedMovie.backdrop_path})`)
			if(selectedMovie !== null) window.localStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));

		}, [selectedMovie])
	
		React.useEffect(()=>{
			if(localStorageMovies !== null && movies !== null){ 
				console.log("localStorage is FULL and movies state is FULL")
				getPopularMovies()

			} else if(localStorageMovies !== null && movies == null) {
				console.log("localStorage is FULL and movies state is EMPTY")

				setMovies(localStorageMovies)

			} else if(localStorageMovies == null  && movies == null) {
				console.log("localStorage is EMPTY and movies state is EMPTY")

				getPopularMovies()

			}

			if(localStorageCurrentPage !== null && currentPage === 1){
				setCurrentPage(localStorageCurrentPage)
			}
			console.log("useEffect : currentPage triggered")
			window.localStorage.setItem('currentPage', JSON.stringify(currentPage));
		}, [currentPage])

		React.useEffect(()=>{
			console.log("useEffect selectedMovieActors triggered")
		}, [selectedMovieActors])

		React.useEffect(()=>{
			console.log("useEffect selectedMovieDirectors triggered")
		}, [selectedMovieDirectors])


	function scrollToTop(){
		window.scrollTo({
			top: 60, //60px to not see the navbar
			behavior: 'smooth'
		}) 
		if(!isMobile){
			document.getElementById("RecommendedMovies--Desktop--selectedMovie").scrollTo({
				top:0,
				behavior:"smooth"
			});
		}
	}

	function scrollToFirstRecommendedMovie() {
		document.getElementById("RecommendedMovies--movieList").scrollTo({
			left: -9999, //60px to not see the navbar
			behavior: 'smooth'
		}) 
		window.scrollBy(0, window.innerHeight);
	}

	function nextPage(){
		scrollToFirstRecommendedMovie()
			if(currentPage !== totalPages){
			 return setCurrentPage(currentPage+1)
			}
	}

	function prevPage() {
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
		window.localStorage.setItem('selectedMovieActors', JSON.stringify(actors));
		window.localStorage.setItem('selectedMovieDirectors', JSON.stringify(directors));

		
	}

	async function getPopularMovies() {
		const response = await fetch(`${BASE_URL}/discover/movie?${API_KEY}&sort_by=popularity.desc&page=${currentPage}`)
		const PopularMovies = await response.json();
		setMovies(PopularMovies.results)
		setTotalPages(PopularMovies.total_pages)
		window.localStorage.setItem('movies', JSON.stringify(PopularMovies.results));

	}
	
	return (
		<main className={clsx({"RecommendedMovies--Desktop":!isMobile, "RecommendedMovies--Mobile":isMobile})} >
			{ selectedMovie &&
				<div className={clsx({"RecommendedMovies--Desktop--selectedMovie":!isMobile, "RecommendedMovies--Mobile--selectedMovie":isMobile})} id="RecommendedMovies--Desktop--selectedMovie">
				{!isMobile && <div className="backdrop--vignette"></div>}
					<img className={clsx({"selectedMovie--poster--Desktop":!isMobile,"selectedMovie--poster--Mobile":isMobile})} src={`${IMG_BASE_URL}${selectedMovie.poster_path}`} alt={`movie poster of ${selectedMovie.title}`}/>

				
				<div className={clsx({"selectedMovie--Desktop--info":!isMobile, "selectedMovie--Mobile--info":isMobile})}>
					<h3 className="info--title">{selectedMovie.title}</h3>
					<div className="info--stats">
						<p className="stats--note">{(selectedMovie.vote_average * 10).toFixed(0)}% <FaThumbsUp fill="greenyellow"/> | {((10-selectedMovie.vote_average) *10).toFixed(0)}% <FaThumbsDown fill="indianred"/></p>
						<p className="stats--reviewCount">({selectedMovie.vote_count} reviews)</p>
						<p className="stats--date"><strong>Release:</strong> {selectedMovie.release_date}</p>
						<p className="stats--runtime"><strong>Runtime:</strong> {minutesToHours(selectedMovie.runtime)}</p>
					</div>
					<p className="info--overview">
						{selectedMovie.overview}
					</p>
					<div className="info--tags">
						<p className="tags--genre">
							<em>GENRE:</em> {selectedMovie.genres.map((genre,genreIndex)=>
								(genreIndex >= selectedMovie.genres.length-1)? `${genre.name}`: `${genre.name}, `
							)}
						</p>
						{ selectedMovieActors &&
						<p className="tags--actors"><em>STARRING:</em> {selectedMovieActors.map((actor,actorIndex)=>{
							
							if(!showMoreActors){
								if(actorIndex >=4){return;}else{
									return((actorIndex >= 3)? `${actor.name} and ${selectedMovieActors.length - 4} others...` : `${actor.name}, `)
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
						<p className="tags--directors">DIRECTED BY: {selectedMovieDirectors.map((director,directorIndex)=>
								(directorIndex >= selectedMovieDirectors.length-1)? `${director.name}` : `${director.name}, `
						)}
						</p>
						}
					</div>
					
					<div className="info--buttons">
						<button className="buttons--watchNow">WATCH NOW</button>
						<button className="buttons--wishlist">ADD TO WISHLIST</button>
					</div>

					<div className="info--trailer">
						{selectedMovie.videos.results.length>0 && 
						 <div className={clsx({"videoContainer--Desktop":!isMobile, "":isMobile})}>
							<iframe
						 src={`https://www.youtube-nocookie.com/embed/${selectedMovie.videos.results[currentTrailer].key}`}
						 frameBorder="0"
						 allowFullScreen ng-show="showvideo"
						 allow="autoplay; encrypted-media"
						 title="trailer"
						 width={!isMobile? "100%" : "100%" }
						 height={!isMobile? "300px" : ""}
						 
					 />
						 </div>
						}
					</div>
				</div>
			</div>
			}
			<div className="RecommendedMovies--Element">
				<p className={clsx({"recommended-movies-title--Desktop":!isMobile, "recommended-movies-title--Mobile":isMobile})}>RECOMMENDED MOVIES:</p>
				{ movies !== null &&
				<div id="RecommendedMovies--movieList" className="RecommendedMovies--movieList">
				{	movies.map((movie,movieIndex) =>{
						return(
							<div className="RecommendedMovies--movieElement" onClick={scrollToTop} key={`movie#${movieIndex}`}>
								<img className={clsx({"movieElement--poster--Desktop":!isMobile, "movieElement--poster--Mobile":isMobile})} src={`${IMG_BASE_URL}${movie.poster_path}`} alt={`movie poster for ${movie.title}`} onClick={()=>selectMovie(movie.id)}/>
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
