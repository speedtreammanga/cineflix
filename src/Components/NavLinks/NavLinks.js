import clsx from 'clsx';
import React from 'react'
import { Link } from 'react-router-dom';
import About from '../MainContent/About';
import RecommendedMovies from '../MainContent/RecommendedMovies';
import Search from '../MainContent/Search';
import Wishlist from '../MainContent/Wishlist';

export default function NavLinks(props) {
  let isMobile = props.isMobile;
  let expandHamburger = props.expandHamburger;
  let setExpandHamburger = props.setExpandHamburger
  let language = props.language
  let setLanguage = props.setLanguage
  let flex = props.flex


	

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

	return (
		<ul className={clsx({"Navbar--Desktop--list":!isMobile && flex !== "column", "Navbar--Mobile--list":isMobile, "column": (flex==="column"), "row": (flex==="row")})}>
			<li className={clsx({"li--Desktop":!isMobile, "li--Mobile":isMobile})}><Link to="/" element={<RecommendedMovies/>} className="Navbar--link" onClick={()=>setExpandHamburger(false)}>{textInLanguage("Popular movies", "Films populaires", "Peliculas populares")}</Link></li>
			<li className={clsx({"li--Desktop":!isMobile, "li--Mobile":isMobile})}><Link to="/about" element={<About/>} className="Navbar--link" onClick={()=>setExpandHamburger(false)}>{textInLanguage("About", "À propos", "Acerca de nosotros")}</Link></li>
			<li className={clsx({"li--Desktop":!isMobile, "li--Mobile":isMobile})}><Link to="/wishlist" element={<Wishlist/>} className="Navbar--link" onClick={()=>setExpandHamburger(false)}>{textInLanguage("My wishlist", "Ma liste", "Mi lista")}</Link></li>
			<li className={clsx({"li--Desktop":!isMobile, "li--Mobile":isMobile})}><Link to="/search" element={<Search/>} className="Navbar--link" onClick={()=>setExpandHamburger(false)}>{textInLanguage("Search", "Rechercher", "poopoopeepeeeeeee")}</Link></li>
			{isMobile && 
				<p className="li--Mobile">Profile ...</p>
			}
		</ul>
	)
}
