import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faCalculator, faMoneyCheckDollar, faMoneyBillTrendUp, faArrowTrendUp, faFileLines } from '@fortawesome/free-solid-svg-icons';
import React, { lazy, Suspense, useEffect, useState  } from "react";
import axios from 'axios';
import moment from 'moment';
import '../../styles/BudgetPlanner/BudgetPlanner.css'

const BudgetPlanner = ({ userInfo, getUserInfo, windowWidth }) => {
    const [addBudgetModalOpen, setAddBudgetModalOpen] = useState(false)
    const [budgetType, setBudgetType] = useState('Budget Type')
    const [budgetTimeFrame, setBudgetTimeFrame] = useState('Choose Time Frame')
    const [budgetLoader, setBudgetLoader] = useState(false)
    const [budgetTimeFrameMenuOpen, setBudgetTimeFrameMenuOpen] = useState(false)
    const [budgetTypeMenuOpen, setBudgetTypeMenuOpen] = useState(false)
    const [budgetAmount, setBudgetAmount] = useState({
        value: '',
        placeholder: 'Maximum Spending'
    });
    const [budgets, setBudgets] = useState() 
    const [expenses, setExpenses] = useState()
    const [budgetAmountRedPlaceHolder, setBudgetAmountRedPlaceHolder] = useState(false)
    const [budgetTimeFrameRedPlaceHolder, setBudgetTimeFrameRedPlaceHolder] = useState(false)
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseDescriptionCharCount, setExpenseDescriptionCharCount] = useState(0);
    const MAX_DESCRIPTION_CHARACTERS = 250;
    const [redExpenseAmountPlaceHolder, setRedExpenseAmountPlaceHolder] = useState(false)
    const [expenseAmount, setExpenseAmount] = useState({
        value: '',
        placeholder: 'Expense Amount'
    });
    const [openModalId, setOpenModalId] = useState(null);

    useEffect(() => {
        if (userInfo) {
            setBudgets(userInfo.budgets)
            setExpenses(userInfo.expenses)
        }
    },[userInfo])

    const toggleAddBudgetModalOpen = () => {
        if (addBudgetModalOpen) {
            setAddBudgetModalOpen(false)
            setBudgetTimeFrame('Choose Time Frame')
            setBudgetType('Budget Type')
            setBudgetAmount({ ...budgetAmount, value: '', placeholder: 'Maximum Spending' })
            setBudgetTimeFrameRedPlaceHolder(false)
            setBudgetAmountRedPlaceHolder(false)
            setBudgetTimeFrameMenuOpen(false)
            setBudgetTypeMenuOpen(false)
        } else {
            setAddBudgetModalOpen(true)
        }
    }

    const toggleBudgetTimeFrameMenuOpen = () => {
        if (budgetTimeFrameMenuOpen) {
            setBudgetTimeFrameMenuOpen(false)
        } else {
            setBudgetTimeFrameMenuOpen(true)
            setBudgetTypeMenuOpen(false)
        }
    }

    const toggleBudgetTypeMenuOpen = () => {
        if (budgetTypeMenuOpen) {
            setBudgetTypeMenuOpen(false)
        } else {
            setBudgetTypeMenuOpen(true)
            setBudgetTimeFrameMenuOpen(false)
        }
    }

    const AddBudget = async (event) => {
        event.preventDefault()
        setBudgetLoader(true)
        if (budgetAmount.value === '' && budgetTimeFrame === 'Choose Time Frame') {
            setBudgetAmountRedPlaceHolder(true)
            setBudgetAmount({ ...budgetAmount, placeholder: 'Please Fill Out This Field'})
            setBudgetTimeFrameRedPlaceHolder(true)
            setBudgetTimeFrame('Please Choose a Time Frame')
            setBudgetLoader(false)
            return
        } else if (budgetAmount.value === '') {
            setBudgetAmountRedPlaceHolder(true)
            setBudgetAmount({ ...budgetAmount, placeholder: 'Please Fill Out This Field'})
            setBudgetLoader(false)
            return
        } else if (budgetTimeFrame === 'Choose Time Frame') {
            setBudgetTimeFrameRedPlaceHolder(true)
            setBudgetTimeFrame('Please Choose a Time Frame')
            setBudgetLoader(false)
            return
        }

        const budget = {
            budgetType: budgetType,
            budgetTimeFrame: budgetTimeFrame,
            budgetAmount: budgetAmount
        }
        try {   
            const response = await axios.post('http://localhost:5000/add-budget', budget, { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                await getUserInfo()
                setAddBudgetModalOpen(false)
                setBudgetTimeFrame('Choose Time Frame')
                setBudgetType('Budget Type')
                setBudgetAmount({ ...budgetAmount, value: '', placeholder: 'Maximum Spending' })
                setBudgetTimeFrameRedPlaceHolder(false)
                setBudgetAmountRedPlaceHolder(false)
                setBudgetTimeFrameMenuOpen(false)
                setBudgetTypeMenuOpen(false)
            }
            setBudgetLoader(false)
        } catch (err) {
            console.log(err)
            setBudgetLoader(false)
        }
    }

    useEffect(() => {
        if (budgetAmount.value !== '') {
            setBudgetAmountRedPlaceHolder(false)
            setBudgetAmount({ ...budgetAmount, placeholder: 'Maximum Spending' })
        }
    },[budgetAmount.value])

    useEffect(() => {
        if (budgetTimeFrame !== 'Please Choose a Time Frame') {
            setBudgetTimeFrameRedPlaceHolder(false)
            setExpenseAmount({ ...expenseAmount, placeholder: 'Expense Amount' })
        }
    },[budgetTimeFrame])

    const toggleAddBudgetExpenseModalOpen = (id, budgetType) => {
        if (id === null) {
            setRedExpenseAmountPlaceHolder(false)
            setExpenseAmount({ ...expenseAmount, value: '', placeholder: 'Expense Amount' })
            setExpenseDescription('')
        }
        setBudgetType(budgetType)
        setOpenModalId(openModalId !== id ? id : null);
    };

    useEffect(() => {
        if (expenseDescription.length > MAX_DESCRIPTION_CHARACTERS) {
          setExpenseDescription(expenseDescription.slice(0, MAX_DESCRIPTION_CHARACTERS));
        }
        setExpenseDescriptionCharCount(expenseDescription.length);
    }, [expenseDescription]);

    useEffect(() => {
        if (expenseAmount.value !== '') {
            setRedExpenseAmountPlaceHolder(false)
            setExpenseAmount({ ...expenseAmount, placeholder: 'Expense Amount' })
        }
    },[expenseAmount.value])

    const addExpense = async (event) => {    
        event.preventDefault();
        setBudgetLoader(true)
        if (!expenseAmount.value) {
            setRedExpenseAmountPlaceHolder(true)
            setExpenseAmount({ ...expenseAmount, placeholder: 'Please Fill Out This Field' })
            setBudgetLoader(false)
            return
        }
        const expense = {
            expenseType: budgetType,
            expenseAmount: expenseAmount.value,
            expenseDescription: expenseDescription
        }
        try {
            const response = await axios.post('http://localhost:5000/add-expense', expense, { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                getUserInfo()
                toggleAddBudgetExpenseModalOpen(null, 'Budget Type')
            }
            setBudgetLoader(false)
        } catch (err) {
            console.log(err)
            setBudgetLoader(false)
        }
    }

    if (!budgets) {
        return <div className="loaderWrapper"><span class="loader"></span></div>
    }

    return (
        <div className="budgetPlannerWrapper">
            <div className="budgettPlannerContent">
                <div className="budgetPlannerHeader">
                    <h2 className="budgetsHeaderTitle">Budgets</h2>
                    <div className="budgetsHeaderBtnsWrapper">
                        <button className="budgetsBtn add" onClick={() => toggleAddBudgetModalOpen()}>Add Budget</button>
                        <button className="budgetsBtn delete">Delete Budget</button>
                    </div>
                    {addBudgetModalOpen &&(
                        <div className="addBudgetModalWrapper">
                            <form className="addBudgetModalContent" onSubmit={AddBudget}>
                                <h3 className="addBudgetModalTitle">Add a Budget</h3>
                                <div className="addBudgetModalMainContent">
                                    <button type="button" className={`addBudgetBudgetTypeBtn ${budgetTypeMenuOpen ? 'open' : ''}`} 
                                    onClick={() => toggleBudgetTypeMenuOpen()}>{budgetType}
                                    {budgetTypeMenuOpen ? (
                                        <FontAwesomeIcon className={`addBudgetModalAngleUpIcon 
                                        ${budgetTypeMenuOpen ? 'open' : ''}`} icon={faAngleUp} />
                                    ) : (
                                        <FontAwesomeIcon className={`addBudgetModalAngleDownIcon 
                                        ${budgetTypeMenuOpen ? 'open' : ''}`} icon={faAngleDown} />
                                    )}
                                    {budgetTypeMenuOpen &&(
                                        <ul className="addBudgetTypeMenuWrapper">
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Debt Payments')}>Debt Payments</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Education')}>Education</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Entertainment')}>Entertainment</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Food')}>Food</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Gifts & Donations')}>Gifts & Donations</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Healthcare')}>Healthcare</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Housing')}>Housing</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Insurance')}>Insurance</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Investments')}>Investments</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Miscellaneous')}>Miscellaneous</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Personal Care')}>Personal Care</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Savings')}>Savings</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Shopping')}>Shopping</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Transportation')}>Transportation</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Travel')}>Travel</li>
                                            <li className="addBudgetMenuItem" 
                                                onClick={() => setBudgetType('Utilities')}>Utilities</li>
                                        </ul>
                                    )}</button>
                                    <label className="addBudgetLabel">Budget Time Frame<span className="addBudgetRequireTag"> *</span></label>
                                    <button type="button" className={`addBudgetBudgetTimeFrameBtn ${budgetTimeFrameMenuOpen ? 'open' : ''} 
                                    ${budgetTimeFrameRedPlaceHolder ? 'red' : ''}`} 
                                    onClick={() => toggleBudgetTimeFrameMenuOpen()}>{budgetTimeFrame}
                                    {budgetTimeFrameMenuOpen ? (
                                        <FontAwesomeIcon className={`addBudgetModalAngleUpIcon 
                                        ${budgetTimeFrameMenuOpen ? 'open' : ''}`} icon={faAngleUp} />
                                    ) : (
                                        <FontAwesomeIcon className={`addBudgetModalAngleDownIcon 
                                        ${budgetTimeFrameMenuOpen ? 'open' : ''}`} icon={faAngleDown} />
                                    )}
                                    {budgetTimeFrameMenuOpen &&(
                                        <ul className="addBudgetTimeFrameMenuWrapper">
                                            <li className="addBudgetTimeFrameItem" onClick={() => setBudgetTimeFrame('Daily')}>Daily</li>
                                            <li className="addBudgetTimeFrameItem" onClick={() => setBudgetTimeFrame('Weekly')}>Weekly</li>
                                            <li className="addBudgetTimeFrameItem" onClick={() => setBudgetTimeFrame('Monthly')}>Monthly</li>
                                            <li className="addBudgetTimeFrameItem" onClick={() => setBudgetTimeFrame('Yearly')}>Yearly</li>
                                        </ul>
                                    )}</button>
                                    <label htmlFor="max spending" className="addBudgetLabel">Budget Limit 
                                    <span className="addBudgetRequireTag"> *</span></label>
                                    <input className={`addBudgetBudgetLimitInput ${budgetAmountRedPlaceHolder ? 'red' : ''}`} 
                                    name="max spending" type="text" value={budgetAmount.value}
                                    placeholder={budgetAmount.placeholder} onChange={(e) => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                           setBudgetAmount({ ...budgetAmount, value: e.target.value })
                                        }
                                    }} ></input>
                                </div>
                                <div className="addBudgetModalFooter">
                                    <button type="button" className="addBudgetModalBtn close" 
                                    onClick={() => toggleAddBudgetModalOpen()}>Close</button>
                                    {budgetLoader ? (
                                        <button type="button" className="addBudgetModalBtn add"><span class="modalLoader"></span></button>
                                    ) : (
                                        <button type="submit" className="addBudgetModalBtn add">Add Budget</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
                <div className="renderedBudgetsWrapper">
                {budgets.map((budget) => {
                    // Filter expenses by type.
                    let budgetExpenses = expenses.filter(expense => expense.expense_type === budget.budget_type);

                    // Get the current date.
                    let currentDate = moment();

                    // Filter expenses by date based on the budget's time frame.
                    switch (budget.time_frame) {
                        case 'Daily':
                            budgetExpenses = budgetExpenses.filter(expense => moment(expense.expense_date).isSame(currentDate, 'day'));
                            break;
                        case 'Weekly':
                            budgetExpenses = budgetExpenses.filter(expense => moment(expense.expense_date).isSame(currentDate, 'week'));
                            break;
                        case 'Monthly':
                            budgetExpenses = budgetExpenses.filter(expense => moment(expense.expense_date).isSame(currentDate, 'month'));
                            break;
                        case 'Yearly':
                            budgetExpenses = budgetExpenses.filter(expense => moment(expense.expense_date).isSame(currentDate, 'year'));
                            break;
                        default:
                            // If the time frame is not recognized, don't filter expenses by date.
                            break;
                    }

                    const currentSpending = budgetExpenses.reduce((sum, expense) => sum + expense.expense_amount, 0);
                    return (
                        <div className="budgetWrapper" key={budget.budget_id}>
                            <div className="budgetInfoWrapper">
                                <div className="budgetTypeAndTimeWrapper">
                                    <h4 className="budgetType">{budget.budget_type}</h4>
                                    <span className="budgetTimeFrame">{budget.time_frame} Budget</span>
                                </div>
                                <span className="budgetCosts">
                                    ${currentSpending.toLocaleString()} / ${budget.max_spending.toLocaleString()}</span>
                            </div>
                            <progress className="budgetProgressBar" value={currentSpending} max={budget.max_spending}></progress>
                            <div className="budgetFooterWrapper">
                                <button className="budgetBtns view">View Expenses</button>
                                <button className="budgetBtns add" 
                                onClick={() => toggleAddBudgetExpenseModalOpen(budget.budget_id, budget.budget_type)}>Add Expense</button>
                            </div>
                            {openModalId === budget.budget_id && (
                                <div className="addBudgetExpenseModalWrapper">
                                    <form className="addBudgetExpenseModalContent" onSubmit={addExpense}>
                                        <h3 className="addBudgetExpenseModalTitle">Add an Expense</h3>
                                        <div className="addBudgetExpenseModalMainContent">
                                            <label htmlFor="Expense Amount" className="addBudgetExpenseModalLabel">Amount<span className="requireTag"> *</span></label>
                                            <input type="text" name="Expense Amount" placeholder={expenseAmount.placeholder} 
                                            className={`addBudgetExpenseModalInput ${redExpenseAmountPlaceHolder ? 'field' : ''}`} 
                                            onChange={(e) => {
                                                const re = /^[0-9\b]+$/;
                                                if (e.target.value === '' || re.test(e.target.value)) {
                                                    setExpenseAmount({ ...expenseAmount, value: e.target.value })
                                                }
                                            }} 
                                            value={expenseAmount.value}/>
                                            <label htmlFor="description" className="budgetExpenseDescriptionLabel">Expense Description
                                            <span className={`budgetExpenseDescriptionCharCount ${expenseDescription.length === 250 ? 'maxCount' : ''}`}>
                                                {expenseDescriptionCharCount} / 250</span></label>
                                            <textarea className="budgetExpenseDescription" name="description" value={expenseDescription} 
                                            onChange={(e) => setExpenseDescription(e.target.value)} maxLength={MAX_DESCRIPTION_CHARACTERS}></textarea>
                                        </div>
                                        <div className="addBudgetExpenseModalFooter">
                                            <button type="button" className="addBudgetExpenseModalCloseBtn" 
                                            onClick={() => toggleAddBudgetExpenseModalOpen(null, 'Budget Type')}>
                                                Close</button>
                                            {budgetLoader ? (
                                                <button type="button" className="addBudgetExpenseModalAddExpenseBtn"><span class="modalLoader"></span></button>
                                            ) : (
                                                <button type="submit" className="addBudgetExpenseModalAddExpenseBtn">Add Expense</button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )   
}

export default BudgetPlanner;
