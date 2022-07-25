import './App.css';
import RecommendedMovies from './Components/MainContent/RecommendedMovies';
import Navbar from './Components/Navbar/Navbar';
import React from "react"
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import Footer from './Components/Footer/Footer';

function App() {
  const [isMobile, setIsMobile] = React.useState(true)
  const [expandHamburger, setExpandHamburger] = React.useState(false)
  const [backdropDesktop, setBackdropDesktop] = React.useState({})
	const [language, setLanguage] = React.useState("en-US")


  React.useEffect(()=>{
    handleResize()
  },[])

  function handleResize(){
    if(window.innerWidth >= 768){
      setIsMobile(false)
      setExpandHamburger(false)
    } else {
      setIsMobile(true)
    }
  }


  window.addEventListener("resize", handleResize);


  return (
    <div className="App" style={{backgroundImage:backdropDesktop, backgroundSize:"100%", backgroundRepeat:"no-repeat", backgroundPosition:"0% 60px"}}>
      <div className={clsx({"backdropDesktop":!isMobile, "backdropMobile":isMobile})}>
        <Navbar isMobile={isMobile} setIsMobile={setIsMobile} language={language} setLanguage={setLanguage} expandHamburger={expandHamburger} setExpandHamburger={setExpandHamburger}/>
        <Outlet context={[isMobile, setIsMobile, backdropDesktop, setBackdropDesktop, language, setLanguage]} />
        <Footer isMobile={isMobile} setIsMobile={setIsMobile} language={language} setLanguage={setLanguage} expandHamburger={expandHamburger} setExpandHamburger={setExpandHamburger}/>
      </div>
    </div>
  );
}

export default App;
