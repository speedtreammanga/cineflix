import React from 'react'


const IMG_QUALITY = "w342"
const IMG_BASE_URL = `https://image.tmdb.org/t/p/${IMG_QUALITY}`
const IMG_BASE_URL_PERSON = `https://image.tmdb.org/t/p/w185`

export default function SearchResults(props) {
	return (
		<div className="searchResult--allItems">
			{props.searchResults && 
			props.searchResults.map(item => {
				return(
				<div className="searchResult--item--general">
					{(item.media_type === "movie" || props.type === "movie?") &&
						<div className="searchResult--item--movie">
							{item.poster_path?
								<img className="item--movie--poster" src={`${IMG_BASE_URL}${item.poster_path}`} alt={`${item.title}'s movie poster`}/>
								:
								<div style={{width:"130px", height:"calc(130px*1.67)", borderRadius:"10px", backgroundColor:"grey"}}></div>
							}
							<p className="searchResult--item--title">{item.title}</p>
							<p>{`(Movie)`}</p>
						</div>
					}		

					{(item.media_type === "person" || props.type === "person?") &&
						<div className="searchResult--item--person">
							{item.profile_path?
							<div className="item--person--portait">
								<img className="item--person--poster" src={`${IMG_BASE_URL_PERSON}${item.profile_path}`} alt={`${item.name}`}/>
							</div>
							:
							<div style={{width:"130px", height:"calc(130px*1.67)", borderRadius:"10px", backgroundColor:"grey"}}></div>
						}
							<div className="person--info">
								<p className="searchResult--item--title">{item.name}</p>
								<p>{`(Person - ${item.known_for_department})`}</p>
							</div>
						</div>
					}	

					{(item.media_type === "tv" || props.type === "tv?")&&
						<div className="searchResult--item--tv">
							{item.poster_path?
							<img className="item--tv--poster" src={`${IMG_BASE_URL}${item.poster_path}`} alt={`${item.title}'s tv show poster`}/>
							:
							<div style={{width:"130px", height:"calc(130px*1.67)", borderRadius:"10px", backgroundColor:"grey"}}></div>
						}
							<p className="searchResult--item--title">{item.name}</p>
							<p>{`(TV)`}</p>
						</div>
					}			
				</div>
				)
			})}
		</div>
	)
}
