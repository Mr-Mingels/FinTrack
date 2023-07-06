import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faCalculator, faMoneyCheckDollar, faMoneyBillTrendUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import React, { lazy, Suspense, useEffect, useState  } from "react";
import axios from 'axios';
import '../styles/Main.css'

const ExpenseTracker = () => {
    return (
        <div className="expenseTrackerWrapper">
            Hi my name is pierre
        </div>
    )
}

export default ExpenseTracker