import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState  } from "react";
import axios from 'axios';
import moment from 'moment';
import '../../styles/BudgetPlanner/BudgetPlanner.css'
import AddBudget from "./AddBudget";
import AddBudgetExpense from "./AddBudgetExpense";
import ViewExpenses from "./ViewExpenses";
import logo from '../../assets/logo.png'

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
    const [expenseDescriptionModalOpen, setExpenseDescriptionModalOpen] = useState(false)
    const [expenseDescriptionCharCount, setExpenseDescriptionCharCount] = useState(0);
    const MAX_DESCRIPTION_CHARACTERS = 250;
    const [redExpenseAmountPlaceHolder, setRedExpenseAmountPlaceHolder] = useState(false)
    const [expenseAmount, setExpenseAmount] = useState({
        value: '',
        placeholder: 'Expense Amount'
    });
    const [addBudgetExpenseModalId, setAddBudgetExpenseModalId] = useState(null);
    const [toggleDeleteOn, setToggleDelete] = useState(false)
    const [deleteBudgetModalId, setDeleteBudgetModalId] = useState(null)
    const [viewExpensesModalId, setViewExpensesModalId] = useState(null)

    useEffect(() => {
        if (addBudgetModalOpen || deleteBudgetModalId || viewExpensesModalId || addBudgetExpenseModalId) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, [addBudgetModalOpen, deleteBudgetModalId, viewExpensesModalId, addBudgetExpenseModalId]);

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

    const handleAddBudget = async (event) => {
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
        } else if (budgetTimeFrame === 'Please Choose a Time Frame') {
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
            const response = await axios.post('/add-budget', budget, { withCredentials: true })
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
        setAddBudgetExpenseModalId(addBudgetExpenseModalId !== id ? id : null);
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
            const response = await axios.post('/add-expense', expense, { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                await getUserInfo()
                toggleAddBudgetExpenseModalOpen(null, 'Budget Type')
            }
            setBudgetLoader(false)
        } catch (err) {
            console.log(err)
            setBudgetLoader(false)
        }
    }

    const toggleDeleteBtns = () => {
        if (toggleDeleteOn) {
            setToggleDelete(false)
        } else {
            setToggleDelete(true)
        }
    }

    const toggleDeleteBudgetModalOpen = (budgetId) => {
        setDeleteBudgetModalId(deleteBudgetModalId !== budgetId ? budgetId : null);
    };

    const deleteBudget = async () => {
        console.log(deleteBudgetModalId)
        try {
            const response = await axios({
                method: 'delete',
                url: '/delete-budget',
                data: [deleteBudgetModalId],
                withCredentials: true
            });
            console.log(response)
            if (response.status === 200) {
                await getUserInfo()
                toggleDeleteBudgetModalOpen(null)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const toggleViewExpensesModalOpen = (budgetId) => {
        setViewExpensesModalId(viewExpensesModalId !== budgetId ? budgetId : null);
    }

    const openExpenseDescriptionModal = (description) => {
        setExpenseDescription(description)
        setExpenseDescriptionModalOpen(true)
    }

    const closeExpenseDescriptionModal = () => {
        setExpenseDescriptionModalOpen(false)
        setExpenseDescription('')
    }

    if (!budgets) {
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
        <div className="budgetPlannerWrapper">
            <div className="budgettPlannerContent">
                <div className="budgetPlannerHeader">
                    <h2 className="budgetsHeaderTitle">Budgets</h2>
                    <div className="budgetsHeaderBtnsWrapper">
                        <button className="budgetsBtn add" onClick={() => toggleAddBudgetModalOpen()}>Add Budget</button>
                        <button className={`budgetsBtn delete ${toggleDeleteOn ? 'toggleOn' : ''}`} 
                        onClick={() => toggleDeleteBtns()}>Toggle Delete</button>
                    </div>
                    {addBudgetModalOpen && (
                        <AddBudget budgetType={budgetType} setBudgetType={setBudgetType} budgetTypeMenuOpen={budgetTypeMenuOpen} 
                        toggleBudgetTypeMenuOpen={toggleBudgetTypeMenuOpen} budgetTimeFrame={budgetTimeFrame} 
                        budgetTimeFrameMenuOpen={budgetTimeFrameMenuOpen} toggleBudgetTimeFrameMenuOpen={toggleBudgetTimeFrameMenuOpen}
                        setBudgetTimeFrame={setBudgetTimeFrame} budgetTimeFrameRedPlaceHolder={budgetTimeFrameRedPlaceHolder}
                        budgetAmountRedPlaceHolder={budgetAmountRedPlaceHolder} budgetAmount={budgetAmount} setBudgetAmount={setBudgetAmount}
                        toggleAddBudgetModalOpen={toggleAddBudgetModalOpen} budgetLoader={budgetLoader} handleAddBudget={handleAddBudget}/>
                    )}
                </div>
                <div className="renderedBudgetsWrapper">
                {budgets.sort((a, b) => a.budget_type.localeCompare(b.budget_type)).map((budget) => {
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
                                <span className={`budgetCosts ${currentSpending > budget.max_spending ? 'exceededBudget' : ''}`}>
                                    ${currentSpending.toLocaleString()} / ${budget.max_spending.toLocaleString()}</span>
                            </div>
                            <progress className="budgetProgressBar" value={currentSpending} max={budget.max_spending}></progress>
                            <div className="budgetFooterWrapper">
                                {toggleDeleteOn && (
                                    <button className="budgetBtns delete" 
                                    onClick={() => toggleDeleteBudgetModalOpen(budget.budget_id)}><FontAwesomeIcon icon={faTrash} /></button>
                                )}
                                <button className="budgetBtns view" 
                                onClick={() => toggleViewExpensesModalOpen(budget.budget_id)}>
                                    View Expenses</button>
                                <button className="budgetBtns add" 
                                onClick={() => toggleAddBudgetExpenseModalOpen(budget.budget_id, budget.budget_type)}>Add Expense</button>
                            </div>
                            {addBudgetExpenseModalId === budget.budget_id && (
                                <AddBudgetExpense addExpense={addExpense} expenseAmount={expenseAmount} 
                                redExpenseAmountPlaceHolder={redExpenseAmountPlaceHolder} setExpenseAmount={setExpenseAmount}
                                expenseDescription={expenseDescription} expenseDescriptionCharCount={expenseDescriptionCharCount}
                                setExpenseDescription={setExpenseDescription} MAX_DESCRIPTION_CHARACTERS={MAX_DESCRIPTION_CHARACTERS}
                                toggleAddBudgetExpenseModalOpen={toggleAddBudgetExpenseModalOpen} budgetLoader={budgetLoader}/>
                            )}
                            {viewExpensesModalId === budget.budget_id && (
                                <ViewExpenses expenses={expenses} budget={budget} openExpenseDescriptionModal={openExpenseDescriptionModal} 
                                toggleViewExpensesModalOpen={toggleViewExpensesModalOpen} expenseDescription={expenseDescription}
                                closeExpenseDescriptionModal={closeExpenseDescriptionModal}
                                expenseDescriptionModalOpen={expenseDescriptionModalOpen}/>
                            )}
                            {deleteBudgetModalId === budget.budget_id && (
                                <div className="deleteBudgetModalWrapper">
                                    <div className="deleteBudgetModalContent">
                                        <h3 className="deleteBudgetModalTitle">Delete Budget</h3>
                                        <p className="deleteBudgetModalTxt">Are you sure you want to delete this budget?</p>
                                        <div className="deleteBudgetModalFooter">
                                            <button className="deleteBudgetModalBtn close" 
                                            onClick={() => toggleDeleteBudgetModalOpen(null)}>Close</button>
                                            {budgetLoader ? (
                                                <button type="button" className="deleteBudgetModalBtn delete"><span className="modalLoader"></span></button>
                                            ) : (
                                                <button className="deleteBudgetModalBtn delete" onClick={() => deleteBudget()}>Delete</button>
                                            )}
                                        </div>
                                    </div>
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