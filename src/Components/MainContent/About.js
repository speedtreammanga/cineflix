import React from 'react'

export default function About() {
	return (
		<div className="About">
			<div className="gradient--over--backdrop">
				<div className="text--block">
					<h2 className="About--title">About this website</h2>
					<p className="About--text">I made this website to get used to working with an API and to get better at React, js and css...</p>
					<p className="About--credits">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
					<div className="tmdb--logo--container">
						<a href="https://www.themoviedb.org/">
							<img  className="tmdb--logo" src="./tmdb-logo.svg" alt="TMDb's logo"/>
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
