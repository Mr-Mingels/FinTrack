import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faCalculator, faMoneyCheckDollar, faMoneyBillTrendUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import React, { lazy, Suspense, useEffect, useState  } from "react";
import axios from 'axios';
import '../styles/Main.css'
import logo from '../assets/logo.png'

const Main = ({ setExtractedUserInfo, getUserInfoFunction }) => {
    const [userInfo, setUserInfo] = useState()
    const [userSettingsModalOpen, setUserSettingsModalOpen] = useState(false)
    const [logOutLoader, setLogOutLoader] = useState(false)

    const navigate = useNavigate()
    
    const getUserInfo = async () => {
        try {
          const response = await fetch('http://localhost:5000/user-info', { credentials: 'include' });
          // check for user authentication
          if (response.status === 401) {
            navigate('/sign-up');
          } else {
            const userData = await response.json()
            console.log("user data:", userData)
            setUserInfo(userData)
          }
        } catch (error) {
          console.log(error.message)
          console.log(error)
        }
    };

    useEffect(() => {
        getUserInfo()
    },[])

    useEffect(() => {
        getUserInfoFunction(getUserInfo)
    },[])

    useEffect(() => {
        setExtractedUserInfo(userInfo)
    },[userInfo])

    const handleOpenUserSettings = () => {
        if (userSettingsModalOpen) {
            setUserSettingsModalOpen(false)
        } else {
            setUserSettingsModalOpen(true)
        }
    }

    const logOut = async () => {
        setLogOutLoader(true)
        try {
          const response = await axios.get('http://localhost:5000/log-out', { withCredentials: true });
          if (response.status === 200) {
            navigate('/log-in')
          }
          setLogOutLoader(false)
        } catch (err) {
          console.log(err)
          setLogOutLoader(false)
        }
      }

    if (!userInfo) {
        return <div className="loaderWrapper"><span class="loader"></span></div>
    }

    return (
        <section className="mainWrapper">
            <nav className="mainNavBar">
                <div className="mainNavBarContent">
                    <div className="navBarLogoWrapper">
                        <img src={logo} className="navLogoImg" onMouseDown={(e) => e.preventDefault()}/>
                        <h2 className="navAppTitle">fin<span className="navTitleSpecialColor">Track</span></h2>
                    </div>
                    <div className="navBarUserSettingWrapper">
                        <button onClick={() => handleOpenUserSettings()} className="navUserSettingBtn">
                            {userInfo.username.charAt(0).toUpperCase() + userInfo.username.slice(1).toLowerCase()}
                        {userSettingsModalOpen ? (
                            <FontAwesomeIcon className="navAngleUpIcon" icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon className="navAngleDownIcon" icon={faAngleDown} />
                        )}
                        {userSettingsModalOpen && (
                            <div className="navUserSettingsModalWrapper">
                                <div className="navUserSettingsModalContent">
                                    {logOutLoader ? (
                                        <button className="userSettingsLogOutBtn logOutLoader"><span class="modalLoader"></span></button>
                                    ) : (
                                        <button onClick={() => logOut()} className="userSettingsLogOutBtn">Log Out</button>
                                    )}
                                </div>  
                            </div>
                        )}</button>
                    </div>
                </div>
            </nav>
            <section className="mainContentWrapper">
                <div className="mainSideBarWrapper">
                    <div className="mainSideBarContent">
                        <ul className="sideBarListWrapper">
                            <Link to='/expense-tracker' onMouseDown={(e) => e.preventDefault()} className="sideBarListItem"><FontAwesomeIcon 
                            className="sideBarListItemIcon" icon={faMoneyCheckDollar} />Expense Tracker</Link>
                            <li className="sideBarListItem"><FontAwesomeIcon className="sideBarListItemIcon" icon={faMoneyBillTrendUp} />Asset Manager</li>
                            <li className="sideBarListItem"><FontAwesomeIcon className="sideBarListItemIcon" icon={faArrowTrendUp} />Asset Tracker</li>
                            <li className="sideBarListItem"><FontAwesomeIcon className="sideBarListItemIcon" icon={faCalculator} />Tax Calculator</li>
                        </ul>
                    </div>
                </div>
                <div className="renderedContentWrapper">
                    <Outlet />
                </div>
            </section>
        </section>
    )
}

export default Main