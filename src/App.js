import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { lazy, Suspense, useEffect, useState  } from "react";
import ExpenseTracker from './components/ExpenseTracker'

const Authenticate = lazy(() => import('./components/Authenticate'));
const Main = lazy(() => import('./components/Main'))


const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInfoFunction, setUserInfoFunction] = useState()
  const [extractedUserInfo, setExtractedUserInfo] = useState()

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

  const getUserInfoFunction = (userInfoFunction) => {
    setUserInfoFunction(() => userInfoFunction)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div className="loaderWrapper"><span className="loader"></span></div>}>
            <Routes>
              <Route path="/sign-up" element={<Authenticate windowWidth={windowWidth}/>} />
              <Route path="/log-in" element={<Authenticate windowWidth={windowWidth}/>} />
              <Route path="/" element={<Main windowWidth={windowWidth} getUserInfoFunction={getUserInfoFunction} 
              setExtractedUserInfo={setExtractedUserInfo}/>}>
                <Route path='expense-tracker' element={<ExpenseTracker windowWidth={windowWidth} userInfoFunction={userInfoFunction} 
                extractedUserInfo={extractedUserInfo}/>} />
              </Route>
              <Route path='*' element={<RedirectToHome />}/>
            </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;