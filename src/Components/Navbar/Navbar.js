import React from 'react'
import {RiMovie2Line, RiMenuFill} from "react-icons/ri"
import { Link, useNavigate } from 'react-router-dom';
import About from '../MainContent/About';
import RecommendedMovies from '../MainContent/RecommendedMovies';
import Wishlist from '../MainContent/Wishlist';
import NavLinks from '../NavLinks/NavLinks';

export default function Navbar(props) {
  let isMobile = props.isMobile;
  let setIsMobile = props.setIsMobile;
  let expandHamburger = props.expandHamburger;
  let setExpandHamburger = props.setExpandHamburger
  let language = props.language
  let setLanguage = props.setLanguage

  let hamburgerMenuRef = React.useRef();
  const navigate = useNavigate();
  
  React.useEffect(()=>{
    function checkIfClickedOutside(event){
      console.log(event.target)
      if(expandHamburger && hamburgerMenuRef.current && !hamburgerMenuRef.current.contains(event.target)) {
        setExpandHamburger(false)
      }
    }
    function checkIfPressedEscape(event){
      console.log(event.target)
      if(expandHamburger && event.key == 'Escape') {
        setExpandHamburger(false)
      }
    }
      
    document.addEventListener("mousedown", checkIfClickedOutside)
    document.addEventListener("keydown", checkIfPressedEscape)
    
    
    if(!expandHamburger){
      document.removeEventListener("mousedown", checkIfClickedOutside)
      document.removeEventListener("keydown", checkIfPressedEscape)
    }
    return () => {
      console.log("unmounted eventListeners")
      document.removeEventListener("mousedown", checkIfClickedOutside)
      document.removeEventListener("keydown", checkIfPressedEscape)
    }
  }, [expandHamburger])

  return (
    <div>
      {isMobile &&
        <nav className="Navbar--Mobile">
          <div className="logo" onClick={()=>{navigate('/')}}>
            <RiMovie2Line/>
            <p>CineFlix</p>
          </div>
          <div className="Navbar--Mobile--Menu" ref={hamburgerMenuRef}>
            <RiMenuFill className="hamburger" onClick={()=>setExpandHamburger(prevState=> !prevState)}/>
            {expandHamburger && 
              <div className="hamburgerMenu" >
				        <NavLinks isMobile={isMobile} setIsMobile={setIsMobile} language={language} setLanguage={setLanguage} expandHamburger={expandHamburger} setExpandHamburger={setExpandHamburger}/>
              </div>
            }
          </div>
        </nav>
      }

      {!isMobile &&
        <nav className="Navbar--Desktop">
          <div className="logo" onClick={()=>{navigate('/')}}>
            <RiMovie2Line/>
            <p>CineFlix</p>
          </div>
          <div className="Navbar--Desktop--Menu">
            <NavLinks isMobile={isMobile} setIsMobile={setIsMobile} language={language} setLanguage={setLanguage} expandHamburger={expandHamburger} setExpandHamburger={setExpandHamburger}/>
          </div>
          <p className="Navbar--Desktop--profile">Profile ...</p>
        </nav>
        
      }

    </div>
  )
}
