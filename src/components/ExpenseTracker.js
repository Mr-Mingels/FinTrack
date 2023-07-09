import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faCalculator, faMoneyCheckDollar, faMoneyBillTrendUp, faArrowTrendUp, faFileLines } from '@fortawesome/free-solid-svg-icons';
import React, { lazy, Suspense, useEffect, useState  } from "react";
import { Chart as Chartjs, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/ExpenseTracker.css'

Chartjs.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, ChartDataLabels
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
    const [timePeriod, setTimePeriod] = useState('today')
    const [timeFilterMenuOpen, setTimeFilterMenuOpen] = useState(false)
    const [timeFilterTxt, setTimeFilterTxt] = useState('Today')
    const [expenseSum, setExpenseSum] = useState()
    const [dataArr, setDataArr] = useState([])
    const [pieChartData, setPieChartData] = useState()
    const [labelsArr, setLabelsArr] = useState([])
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

    const getBarChartLabels = (timePeriod) => {
        let labelsArr = [];
        const now = new Date();

        if (timePeriod === 'today') {
            labelsArr = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', 
            '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM']
        } else if (timePeriod === 'week') {
            labelsArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
        } else if (timePeriod === 'month') {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for(let i = 1; i <= daysInMonth; i++) {
                labelsArr.push(`${i}`);
            }
        } else if (timePeriod === 'year') {
            labelsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
            "November", "December"]
        }
        setLabelsArr(labelsArr)
    }

    const getBarChartData = (timePeriod) => {
        let dataArr;
        let sum = 0;
        const now = new Date();
    
        if (timePeriod === 'today') {
            dataArr = new Array(24).fill(0);
            expenses.forEach(expense => {
                const expenseDate = new Date(expense.expense_date);
                
                // We check if the expense was made today
                if (expenseDate.toDateString() === now.toDateString()) {
                    const hour = expenseDate.getHours();
                    let expenseAmount = Number(expense.expense_amount);
                    dataArr[hour] += expenseAmount;
                    sum += expenseAmount;
                }
            });
        } else if (timePeriod === 'week') {
            dataArr = new Array(7).fill(0);
            expenses.forEach(expense => {
                const expenseDate = new Date(expense.expense_date);
                
                // Check if the expense was made in the last 7 days
                const daysDiff = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));
                if (daysDiff < 7) {
                    const dayOfWeek = expenseDate.getDay();
                    let expenseAmount = Number(expense.expense_amount);
                    dataArr[dayOfWeek] += expenseAmount;
                    sum += expenseAmount;
                }
            });
        } else if (timePeriod === 'month') {
            dataArr = new Array(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).fill(0);
            expenses.forEach(expense => {
                const expenseDate = new Date(expense.expense_date);
    
                // Check if the expense was made in the current month
                if (expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()) {
                    const day = expenseDate.getDate();
                    let expenseAmount = Number(expense.expense_amount);
                    dataArr[day - 1] += expenseAmount;
                    sum += expenseAmount;
                }
            });
        } else if (timePeriod === 'year') {
            dataArr = new Array(12).fill(0);
            expenses.forEach(expense => {
                const expenseDate = new Date(expense.expense_date);
        
                // Check if the expense was made in the current year
                if (expenseDate.getFullYear() === now.getFullYear()) {
                    const month = expenseDate.getMonth(); // getMonth returns the month in the range 0 to 11
                    let expenseAmount = Number(expense.expense_amount);
                    dataArr[month] += expenseAmount;
                    sum += expenseAmount;
                }
            });
        }
        console.log(dataArr)
        const formattedSum = Number(sum).toLocaleString('en-US');
        setExpenseSum(formattedSum)
        setDataArr(dataArr)
    }
    

    const yourBarChartData = {
        labels: labelsArr,
        datasets: [
          {
            label: 'Expenses',
            data: dataArr, // this data array should be replaced by your actual data
            backgroundColor: '#6d9dc5', // change this to your preferred color
            borderColor: 'black', // change this to your preferred color
            borderWidth: 1,
          }
        ]
    };

    const yourBarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return '$' + value.toLocaleString('en-US');
                    }
                }
            }
        },
        plugins: {
            datalabels: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        var label = context.dataset.label || '';
        
                        if (label) {
                            label += ': $';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toLocaleString('en-US');
                        }
                        return label;
                    }
                }
            }
        }
    };

    const getPieChartData = (timePeriod) => {
        let expensesByType = {};
        const now = new Date();
    
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.expense_date);
    
            let includeExpense = false;
            if (timePeriod === 'today') {
                includeExpense = expenseDate.toDateString() === now.toDateString();
            } else if (timePeriod === 'week') {
                const daysDiff = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));
                includeExpense = daysDiff < 7;
            } else if (timePeriod === 'month') {
                includeExpense = expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
            } else if (timePeriod === 'year') {
                includeExpense = expenseDate.getFullYear() === now.getFullYear();
            }
    
            if (includeExpense) {
                if (!expensesByType[expense.expense_type]) {
                    expensesByType[expense.expense_type] = 0;
                }
                expensesByType[expense.expense_type] += Number(expense.expense_amount);
            }
        });
    
        const dataArr = Object.values(expensesByType); // get the amounts
        const labelsArr = Object.keys(expensesByType); // get the labels
    
        setPieChartData({
            labels: labelsArr,
            datasets: [
                {
                    data: dataArr,
                    backgroundColor: ["#0000FF","#00008B","#1E90FF","#4169E1","#6495ED","#87CEEB","#00BFFF","#87CEFA",
                    "#4682B4","#B0C4DE","#6A5ACD","#483D8B","#0000CD","#4169E1","#191970","#87CEEB"], // adjust these colors to match the number of unique expense types
                    hoverBackgroundColor: ["#0000FF","#00008B","#1E90FF","#4169E1","#6495ED","#87CEEB","#00BFFF","#87CEFA",
                    "#4682B4","#B0C4DE","#6A5ACD","#483D8B","#0000CD","#4169E1","#191970","#87CEEB"] // adjust these colors to match the number of unique expense types
                }
            ]
        });
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    let datasets = ctx.chart.data.datasets;
                    if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                        let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                        let percentage = Math.round((value / sum) * 100) + '%';
                        return percentage;
                    } 
                },
                color: '#fff',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        var label = context.dataset.label || '';
                        if (context.parsed !== null) {
                            label += ': $' + context.parsed.toLocaleString('en-US');
                        }
                        return label;
                    }
                }
            }
        }
    };
    

    useEffect(() => {
        getBarChartData(timePeriod)
        getBarChartLabels(timePeriod)
        getPieChartData(timePeriod)
    },[expenses, timePeriod])

    const toggleOpenTimeFilterMenu = () => {
        if (timeFilterMenuOpen) {
            setTimeFilterMenuOpen(false)
        } else {
            setTimeFilterMenuOpen(true)
        }
    }
    
    return (
        <div className="expenseTrackerWrapper">
            <section className="expenseTrackerSection">
                <div className="expenseChartFilterWrapper">
                    <h3 className="expenseChartFilterTitle">Chart Filter</h3>
                    <div className="timeFilterWrapper">
                        <label className="timeFilterLabel">Time:</label>
                        <button className="timeFilterBtn" onClick={() => toggleOpenTimeFilterMenu()}>{timeFilterTxt}
                            {timeFilterMenuOpen ? (
                                <FontAwesomeIcon className="timeFilterAngleUpIcon" icon={faAngleUp} />
                            ) : (
                                <FontAwesomeIcon className="timeFilterAngleDownIcon" icon={faAngleDown} />
                            )}
                            {timeFilterMenuOpen &&(
                                <ul className="timeFilterDropDownMenuWrapper">
                                    <li className="timeFilterDropDownItem" 
                                    onClick={() => {setTimePeriod('today'); setTimeFilterTxt('Today')}}>Today</li>
                                    <li className="timeFilterDropDownItem" 
                                    onClick={() => {setTimePeriod('week'); setTimeFilterTxt('This Week')}}>This Week</li>
                                    <li className="timeFilterDropDownItem" 
                                    onClick={() => {setTimePeriod('month'); setTimeFilterTxt('This Month')}}>This Month</li>
                                    <li className="timeFilterDropDownItem" 
                                    onClick={() => {setTimePeriod('year'); setTimeFilterTxt('This Year')}}>This Year</li>
                                </ul>
                            )}
                        </button>
                    </div>
                    <p className="chatFilterExpenseTxt">You have spent <span className="expenseSumTxt">${expenseSum}</span> {timeFilterTxt.toLowerCase()}</p>
                </div>
                <div className="renderedExpensesWrapper">
                    <div className="expenseWrapper"> 
                        <h3 className="expenseTitle">Expenses</h3>
                        <button className="deleteExpenseBtn">Delete Expense</button>
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
            </section>
            <section className="expenseChartSection">
                <div className="expenseChartWrapper">
                    <Bar 
                        data={yourBarChartData}
                        options={yourBarChartOptions}>
                    </Bar>
                </div>
                <div className="expensePieChartWrapper">
                    {pieChartData &&(
                        <Pie
                            options={pieChartOptions}
                            data={pieChartData}
                            >
                        </Pie>
                    )}
                </div>
            </section>
        </div>
    )
}

export default ExpenseTracker