import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faCalculator, faMoneyCheckDollar, faMoneyBillTrendUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import React, { lazy, Suspense, useEffect, useState  } from "react";
import axios from 'axios';
import '../styles/ExpenseTracker.css'

const ExpenseTracker = () => {
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false)
    const [expenseTypeMenuOpen, setExpenseTypeMenuOpen] = useState(false)
    const [expenseType, setExpenseType] = useState('Expense Type')
    const [redAddExpenseAmountPlaceHolder, setRedAddExpenseAmountPlaceHolder] = useState(false)
    const [addExpenseAmount, setAddExpenseAmount] = useState({
        value: '',
        placeholder: 'Expense Amount'
    });

    useEffect(() => {
        if (addExpenseAmount.value !== '') {
            setRedAddExpenseAmountPlaceHolder(false)
            setAddExpenseAmount({ ...addExpenseAmount, placeholder: 'Expense Amount' })
        }
    }, [addExpenseAmount.value])

    const handleExpenseTypeMenuToggle = () => {
        if (expenseTypeMenuOpen) {
            setExpenseTypeMenuOpen(false)
        } else {
            setExpenseTypeMenuOpen(true)
        }
    }

    return (
        <div className="expenseTrackerWrapper">
            <div className="renderedExpensesWrapper">
                <div className="addExpenseWrapper"> 
                    <button className="addExpenseBtn" onClick={() => setAddExpenseModalOpen(true)}>Add Expense</button>
                </div>  
                <div>
                    <div className="renderedExpensesHeader">
                        <span className="renderedExpensesHeaderTitles typeOfExpense">Type of Expense</span>
                        <span className="renderedExpensesHeaderTitles amount">Amount Spent</span>
                        <span className="renderedExpensesHeaderTitles date">Date</span>
                    </div>
                </div>
            </div>
            {addExpenseModalOpen && (
                <div className="addExpenseModalWrapper">
                    <form className="addExpenseModalContent">
                        <h3 className="addExpenseModalTitle">Add an Expense</h3>
                        <div className="addExpenseModalMainContent">
                            <button type="button" className={`addExpenseTypeModalBtn ${expenseTypeMenuOpen ? 'open' : ''}`} 
                            onClick={() => handleExpenseTypeMenuToggle()}>
                                {expenseType}
                                {expenseTypeMenuOpen ? (
                                    <FontAwesomeIcon className="addExpenseModalAngleUpIcon" icon={faAngleUp} />
                                ) : (
                                    <FontAwesomeIcon className="addExpenseModalAngleDownIcon" icon={faAngleDown} />
                                )}
                                {expenseTypeMenuOpen &&(
                                    <ul className="addExpenseTypeDropDownWrapper">
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Debt Payments"); setExpenseTypeMenuOpen(false)}}>Debt Payments</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Education"); setExpenseTypeMenuOpen(false)}}>Education</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Entertainment"); setExpenseTypeMenuOpen(false)}}>Entertainment</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Food"); setExpenseTypeMenuOpen(false)}}>Food</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Gifts & Donations"); setExpenseTypeMenuOpen(false)}}>Gifts & Donations</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Healthcare"); setExpenseTypeMenuOpen(false)}}>Healthcare</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Housing"); setExpenseTypeMenuOpen(false)}}>Housing</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Insurance"); setExpenseTypeMenuOpen(false)}}>Insurance</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Investments"); setExpenseTypeMenuOpen(false)}}>Investments</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Miscellaneous"); setExpenseTypeMenuOpen(false)}}>Miscellaneous</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Personal Care"); setExpenseTypeMenuOpen(false)}}>Personal Care</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Savings"); setExpenseTypeMenuOpen(false)}}>Savings</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Shopping"); setExpenseTypeMenuOpen(false)}}>Shopping</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Transportation"); setExpenseTypeMenuOpen(false)}}>Transportation</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Travel"); setExpenseTypeMenuOpen(false)}}>Travel</li>
                                        <li className="addExpenseDropDownItem" 
                                            onClick={() => {setExpenseType("Utilities"); setExpenseTypeMenuOpen(false)}}>Utilities</li>
                                    </ul>
                                )}
                            </button>
                            <label for="Expense Amount" className="addExpenseModalLabel">Amount<span className="expenseRequireTag"> *</span></label>
                            <input name="Expense Amount" placeholder={addExpenseAmount.placeholder} 
                            className={`addExpenseModalInput ${redAddExpenseAmountPlaceHolder ? 'field' : ''}`} 
                            onChange={(e) => setAddExpenseAmount({ ...addExpenseAmount, value: e.target.value })} 
                            value={addExpenseAmount.value}/>
                        </div>
                        <div className="addExpenseModalFooter">
                            <button type="button" className="addExpenseModalCloseBtn" 
                            onClick={() => {setAddExpenseModalOpen(false); setExpenseType('Expense Type'); setExpenseTypeMenuOpen(false)}}>
                                Close</button>
                            <button type="submit" className="addExpenseModalAddExpenseBtn">Add Expense</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ExpenseTracker