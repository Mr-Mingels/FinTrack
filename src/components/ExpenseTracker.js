import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faCalculator, faMoneyCheckDollar, faMoneyBillTrendUp, faArrowTrendUp, faFileLines } from '@fortawesome/free-solid-svg-icons';
import React, { lazy, Suspense, useEffect, useState  } from "react";
import { Chart as Chartjs, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js'
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/ExpenseTracker.css'

Chartjs.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend
)

const ExpenseTracker = ({ extractedUserInfo, userInfoFunction }) => {
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false)
    const [expenseTypeMenuOpen, setExpenseTypeMenuOpen] = useState(false)
    const [expenseType, setExpenseType] = useState('Expense Type')
    const [redExpenseAmountPlaceHolder, setRedExpenseAmountPlaceHolder] = useState(false)
    const [addExpenseLoader, setAddExpenseLoader] = useState(false)
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseDescriptionCharCount, setExpenseDescriptionCharCount] = useState(0);
    const [expenses, setExpenses] = useState([])
    const [expenseDescriptionModalOpen, setExpenseDescriptionModalOpen] = useState(false)
    const MAX_DESCRIPTION_CHARACTERS = 250;
    const [expenseAmount, setExpenseAmount] = useState({
        value: '',
        placeholder: 'Expense Amount'
    });

    useEffect(() => {
        userInfoFunction()
    },[])

    useEffect(() => {
        if (extractedUserInfo) {
            setExpenses(extractedUserInfo.expenses)
        }
    },[extractedUserInfo])

    useEffect(() => {
        if (expenseAmount.value !== '') {
            setRedExpenseAmountPlaceHolder(false)
            setExpenseAmount({ ...expenseAmount, placeholder: 'Expense Amount' })
        }
    }, [expenseAmount.value])

    const handleExpenseTypeMenuToggle = () => {
        if (expenseTypeMenuOpen) {
            setExpenseTypeMenuOpen(false)
        } else {
            setExpenseTypeMenuOpen(true)
        }
    }

    const closeAddExpenseModal = () => {
        setAddExpenseModalOpen(false); 
        setExpenseType('Expense Type'); 
        setExpenseTypeMenuOpen(false); 
        setExpenseDescription(''); 
        setExpenseAmount({...expenseAmount, value: '', placeholder: 'Expense Amount'})
        setRedExpenseAmountPlaceHolder(false)
    }

    const addExpense = async (event) => {    
        event.preventDefault();
        setAddExpenseLoader(true)
        if (!expenseAmount.value) {
            setRedExpenseAmountPlaceHolder(true)
            setExpenseAmount({ ...expenseAmount, placeholder: 'Please Fill Out This Field' })
            setAddExpenseLoader(false)
            return
        }
        const expense = {
            expenseType: expenseType,
            expenseAmount: expenseAmount.value,
            expenseDescription: expenseDescription
        }
        try {
            const response = await axios.post('http://localhost:5000/add-expense', expense, { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                if (expenseType === 'Expense Type' && !expenseDescription) {
                    setExpenses([...expenses, {expense_type: "Miscellaneous", expense_amount: expenseAmount.value, 
                        expense_description: "No description made...", expense_date: new Date()}])
                    closeAddExpenseModal()
                    setAddExpenseLoader(false)
                    return
                } else if (expenseType === 'Expense Type') {
                    setExpenses([...expenses, {expense_type: "Miscellaneous", expense_amount: expenseAmount.value, 
                        expense_description: expenseDescription, expense_date: new Date()}])
                    closeAddExpenseModal()
                    setAddExpenseLoader(false)
                    return
                } else if (!expenseDescription) {
                    setExpenses([...expenses, {expense_type: expenseType, expense_amount: expenseAmount.value, 
                        expense_description: "No description made...", expense_date: new Date()}])
                    closeAddExpenseModal()
                    setAddExpenseLoader(false)
                    return
                }
                setExpenses([...expenses, {expense_type: expenseType, expense_amount: expenseAmount.value, 
                    expense_description: expenseDescription, expense_date: new Date()}])
                closeAddExpenseModal()
            }
            setAddExpenseLoader(false)
        } catch (err) {
            console.log(err)
            setAddExpenseLoader(false)
        }
    }

    const openExpenseDescriptionModal = (description) => {
        setExpenseDescription(description)
        setExpenseDescriptionModalOpen(true)
    }

    const closeExpenseDescriptionModal = () => {
        setExpenseDescriptionModalOpen(false)
        setExpenseDescription('')
    }

    useEffect(() => {
        if (expenseDescription.length > MAX_DESCRIPTION_CHARACTERS) {
          setExpenseDescription(expenseDescription.slice(0, MAX_DESCRIPTION_CHARACTERS));
        }
        setExpenseDescriptionCharCount(expenseDescription.length);
    }, [expenseDescription]);

    const yourBarChartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
          {
            label: 'Expenses',
            data: [12, 19, 3, 5, 2, 3, 10], // this data array should be replaced by your actual data
            backgroundColor: 'blue', // change this to your preferred color
            borderColor: 'black', // change this to your preferred color
            borderWidth: 1,
          }
        ]
      };
      const yourBarChartOptions = {
    };
    
    return (
        <div className="expenseTrackerWrapper">
            <section className="expenseTrackerTopSection">
                <div className="expenseChartFilterWrapper">
                    Chart Filter
                </div>
                <div className="expenseChartWrapper">
                    <Bar 
                        data={yourBarChartData}
                        options={yourBarChartOptions}>
                    </Bar>
                </div>
            </section>
            <div className="renderedExpensesWrapper">
                <div className="addExpenseWrapper"> 
                    <button className="addExpenseBtn" onClick={() => setAddExpenseModalOpen(true)}>Add Expense</button>
                </div>  
                <div>
                    <div className="renderedExpensesHeader">
                        <span className="renderedExpensesHeaderTitles typeOfExpense">Type of Expense</span>
                        <span className="renderedExpensesHeaderTitles amount">Amount Spent</span>
                        <span className="renderedExpensesHeaderTitles date">Date</span>
                        <span className="renderedExpensesHeaderTitles desc">Desc</span>
                    </div>
                    <div className="renderedExpensesContent">
                    {expenses.sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date)).map((expense, index) => {
                        const expenseDate = new Date(expense.expense_date); // Create a new date object with the expense's date
                        const currentDate = new Date(); // Get the current date
                        
                        let formattedDate;

                        // If the expense was added today
                        if (expenseDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]) {
                            const hours = expenseDate.getHours();
                            const minutes = expenseDate.getMinutes();
                            const amOrPm = hours >= 12 ? 'PM' : 'AM';
                            const formattedHours = hours % 12 || 12; // Format hours to be in 12 hour format
                            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Prefix minutes with 0 if they are less than 10

                            formattedDate = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
                        } else {
                            formattedDate = expenseDate.toISOString().split('T')[0];
                        }

                        const formattedAmount = Number(expense.expense_amount).toLocaleString('en-US');

                        return (
                            <div className="renderedExpenseContent" key={index}>
                                <span className="renderedExpenseType">{expense.expense_type}</span>
                                <span className="renderedExpenseAmount">${formattedAmount}</span>
                                <span className="renderedExpenseDate">{formattedDate}</span>
                                <span className="renderedExpenseDesc">
                                    <FontAwesomeIcon className="expenseDescriptionIcon" 
                                    icon={faFileLines} onClick={() => openExpenseDescriptionModal(expense.expense_description)}/></span>
                            </div>  
                        ) 
                    })}
                    {expenseDescriptionModalOpen &&(
                        <div className="expenseDescriptionModalWrapper">
                            <div className="expenseDescriptionModalContent">
                                <h3 className="expenseDescriptionModalTitle">Expense Description</h3>   
                                <textarea className="expenseDescriptionModalDescription" value={expenseDescription} readOnly/>
                                <div className="expenseDescriptionModalFooter">
                                    <button className="expenseDescriptionModalCloseBtn" onClick={() => closeExpenseDescriptionModal()}>
                                    Close</button>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            {addExpenseModalOpen && (
                <div className="addExpenseModalWrapper">
                    <form className="addExpenseModalContent" onSubmit={addExpense}>
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
                            <label htmlFor="Expense Amount" className="addExpenseModalLabel">Amount<span className="expenseRequireTag"> *</span></label>
                            <input type="text" name="Expense Amount" placeholder={expenseAmount.placeholder} 
                            className={`addExpenseModalInput ${redExpenseAmountPlaceHolder ? 'field' : ''}`} 
                            onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (e.target.value === '' || re.test(e.target.value)) {
                                   setExpenseAmount({ ...expenseAmount, value: e.target.value })
                                }
                            }} 
                            value={expenseAmount.value}/>
                            <label htmlFor="description" className="expenseDescriptionLabel">Expense Description
                            <span className={`expenseDescriptionCharCount ${expenseDescription.length === 250 ? 'maxCount' : ''}`}>
                                {expenseDescriptionCharCount} / 250</span></label>
                            <textarea className="expenseDescription" name="description" value={expenseDescription} 
                            onChange={(e) => setExpenseDescription(e.target.value)} maxLength={MAX_DESCRIPTION_CHARACTERS}></textarea>
                        </div>
                        <div className="addExpenseModalFooter">
                            <button type="button" className="addExpenseModalCloseBtn" 
                            onClick={() => closeAddExpenseModal()}>
                                Close</button>
                            {addExpenseLoader ? (
                                <button type="button" className="addExpenseModalAddExpenseBtn"><span class="modalLoader"></span></button>
                            ) : (
                                <button type="submit" className="addExpenseModalAddExpenseBtn">Add Expense</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ExpenseTracker