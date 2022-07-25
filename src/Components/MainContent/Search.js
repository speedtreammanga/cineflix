import React from 'react'
import { useOutletContext } from 'react-router-dom'
import SearchResults from './SearchResults'

import useDebounce from './useDebounce'


const API_KEY = "api_key=3a4a44fcbe03abc4f6aa72497ddf7bb0"
const BASE_URL = "https://api.themoviedb.org/3"

export default function Search() {
	const [searchTerms, setSearchTerms] = React.useState("")
	const [currentPage, setCurrentPage] = React.useState(1)
	const [totalPages, setTotalPages] = React.useState(1)
	const [searchResults, setSearchResults] = React.useState(null)
	const [searchType, setSearchType] = React.useState("multi?")
	const [refresh, setRefresh] = React.useState(false)
  const [isMobile, setIsMobile, backdropDesktop, setBackdropDesktop, language, setLanguage] = useOutletContext();

	const debouncedSearch = useDebounce(searchTerms, 1000)



	React.useEffect(()=>{
		if(debouncedSearch) getSearchResults()
		console.log("debouncedSearch",debouncedSearch)
	}, [debouncedSearch, refresh])

	React.useEffect(()=>{
		console.log(searchResults)
	}, [searchResults])

	React.useEffect(()=>{
		console.log("changed searchType")

		getSearchResults()

		setRefresh(!refresh)
	}, [searchType])

	function handleChange(e){
		const {value, name, type, checked} = e.target
		if(type==="text") setSearchTerms(value)
		else if(type==="radio") {
			setSearchType(value)
		}
		console.log(value)
	}

	async function getSearchResults() {
		const response = await fetch(`${BASE_URL}/search/${searchType}${API_KEY}&query=${debouncedSearch}&sort_by=popularity.desc&page=${currentPage}&language=${language}`)
		const data = await response.json();
		setSearchResults(data.results)
		setTotalPages(data.total_pages)
	}


	return (
		<div className="Search" style={{color:"white"}}>
			<div className="search--section">
				<input type="text" name="searchbar" placeholder="search..." value={searchTerms} onChange={(e)=>handleChange(e)} className="searchbar"></input>
				
				<div className="radio--buttons">
					<div className="radio--button">
						<label htmlFor="radio-all" style={{marginRight:"8px"}}>All</label>
						<input type="radio" name="radio" value="multi?" onChange={(e)=>handleChange(e)} checked={searchType==="multi?" ? true:false} id="radio-all" />
					</div>
					
					<div className="radio--button">
						<label htmlFor="radio-movie" style={{marginRight:"8px"}}>Movies</label>
						<input type="radio" name="radio" value="movie?" onChange={(e)=>handleChange(e)} checked={searchType==="movie?" ? true:false} id="radio-movie" />
					</div>
					
					<div className="radio--button">
						<label htmlFor="radio-tv" style={{marginRight:"8px"}}>TV Shows</label>
						<input type="radio" name="radio" value="tv?" onChange={(e)=>handleChange(e)} checked={searchType==="tv?" ? true:false} id="radio-tv" />
					</div>
					
					<div className="radio--button">
						<label htmlFor="radio-person" style={{marginRight:"8px"}}>People</label>
						<input type="radio" name="radio" value="person?" onChange={(e)=>handleChange(e)} checked={searchType==="person?" ? true:false} id="radio-person" />
					</div>
				</div>

			</div>
			
			<SearchResults searchResults={searchResults}  type={searchType}/>
		</div>
	)
}
