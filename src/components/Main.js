import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState  } from "react";
import axios from 'axios';
import '../styles/Main.css'
import logo from '../assets/logo.png'
import ExpenseTracker from "./ExpenseTracker/ExpenseTracker";
import BudgetPlanner from "./BudgetPlanner/BudgetPlanner";

const Main = ({ windowSize }) => {
    const [userInfo, setUserInfo] = useState()
    const [userSettingsModalOpen, setUserSettingsModalOpen] = useState(false)
    const [logOutLoader, setLogOutLoader] = useState(false)

    const navigate = useNavigate()
    
    const getUserInfo = async () => {
        try {
          const response = await fetch('/user-info', { credentials: 'include' });
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
          const response = await axios.get('/log-out', { withCredentials: true });
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
        return (
            <div className="loaderFullPageWrapper">
                <div className="loaderWrapper">
                    <img src={logo} className="loaderLogoImg" onMouseDown={(e) => e.preventDefault()}/>
                    <span className="loader"></span>
                </div>
            </div>
        )
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
                            <span className="navUserName">
                                {userInfo.username.charAt(0).toUpperCase() + userInfo.username.slice(1).toLowerCase()}</span>
                        {userSettingsModalOpen ? (
                            <FontAwesomeIcon className="navAngleUpIcon" icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon className="navAngleDownIcon" icon={faAngleDown} />
                        )}
                        {userSettingsModalOpen && (
                            <div className="navUserSettingsModalWrapper">
                                <div className="navUserSettingsModalContent">
                                    {logOutLoader ? (
                                        <button className="userSettingsLogOutBtn logOutLoader"><span className="modalLoader"></span></button>
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
                <div className="renderedContentWrapper">
                    <ExpenseTracker windowWidth={windowSize} getUserInfo={getUserInfo} 
                    userInfo={userInfo}/>
                    <BudgetPlanner windowWidth={windowSize} getUserInfo={getUserInfo} 
                    userInfo={userInfo}/>
                </div>
            </section>
        </section>
    )
}

export default Main