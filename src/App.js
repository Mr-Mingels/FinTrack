import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { lazy, Suspense, useEffect, useState  } from "react";
import logo from './assets/logo.png'

const Authenticate = lazy(() => import('./components/Authenticate'));
const Main = lazy(() => import('./components/Main'))


const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const RedirectToHome = () => {  
    const navigate = useNavigate();
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={
            <div className="loaderFullPageWrapper">
                <div className="loaderWrapper">
                    <img src={logo} className="loaderLogoImg" onMouseDown={(e) => e.preventDefault()}/>
                    <span class="loader"></span>
                </div>
            </div>
        }>
            <Routes>
              <Route path="/sign-up" element={<Authenticate windowWidth={windowWidth}/>} />
              <Route path="/log-in" element={<Authenticate windowWidth={windowWidth}/>} />
              <Route path="/" element={<Main windowWidth={windowWidth} />}/>
              <Route path='*' element={<RedirectToHome />}/>
            </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;