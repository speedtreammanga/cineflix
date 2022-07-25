import React from 'react'
import NavLinks from "../NavLinks/NavLinks"

export default function Footer(props) {
  let isMobile = props.isMobile;
  let setIsMobile = props.setIsMobile;
  let expandHamburger = props.expandHamburger;
  let setExpandHamburger = props.setExpandHamburger
  let language = props.language
  let setLanguage = props.setLanguage

	function changeLanguage(){

	}


	return (
		<div className="Footer">
			<div className="Footer--bloc">
				<p style={{marginLeft:"10px"}}><strong>Navigation</strong></p>
				<NavLinks flex="column" isMobile={isMobile} setIsMobile={setIsMobile} language={language} setLanguage={setLanguage} expandHamburger={expandHamburger} setExpandHamburger={setExpandHamburger}/>
			</div>
			
			<div className="Footer--bloc">
				<p ><strong>Language</strong></p>
				<p onClick={()=>{setLanguage("en-US")}} style={{margin:"15px 0",paddingTop:"10px", cursor:"pointer"}}>EN (default)</p>
				<p onClick={()=>{setLanguage("fr-FR")}} style={{margin:"15px 0", cursor:"pointer"}}>FR</p>
				<p onClick={()=>{setLanguage("es-SP")}} style={{margin:"15px 0", cursor:"pointer"}}>ES</p>
			</div>
		</div>
	)
}


