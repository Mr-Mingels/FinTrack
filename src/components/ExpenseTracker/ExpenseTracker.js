import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faFileLines } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState  } from "react";
import { Chart as Chartjs, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import '../../styles/ExpenseTracker/ExpenseTracker.css'
import AddExpense from "./AddExpense";
import DeleteExpense from "./DeleteExpense";
import logo from '../../assets/logo.png'

Chartjs.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, ChartDataLabels
)

const ExpenseTracker = ({ userInfo, getUserInfo, windowWidth}) => {
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false)
    const [deleteExpenseModalOpen, setDeleteExpenseModalOpen] = useState(false)
    const [deleteExpensesListOpen, setDeleteExpensesListOpen] = useState(false)
    const [deleteExpenseLoader, setDeleteExpenseLoader] = useState(false)
    const [deleteExpensesArr, setDeleteExpenseArr] = useState([])
    const [deleteExpenseCountColor, setDeleteExpenseCountColor] = useState(false)
    const [expenseTypeMenuOpen, setExpenseTypeMenuOpen] = useState(false)
    const [expenseType, setExpenseType] = useState('Expense Type')
    const [redExpenseAmountPlaceHolder, setRedExpenseAmountPlaceHolder] = useState(false)
    const [addExpenseLoader, setAddExpenseLoader] = useState(false)
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseDescriptionCharCount, setExpenseDescriptionCharCount] = useState(0);
    const [expenses, setExpenses] = useState([])
    const [expenseDescriptionModalOpen, setExpenseDescriptionModalOpen] = useState(false)
    const [timePeriod, setTimePeriod] = useState('year')
    const [timeFilterMenuOpen, setTimeFilterMenuOpen] = useState(false)
    const [timeFilterTxt, setTimeFilterTxt] = useState('This Year')
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
        if (deleteExpenseModalOpen || addExpenseModalOpen || expenseDescriptionModalOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, [deleteExpenseModalOpen, addExpenseModalOpen, expenseDescriptionModalOpen]);

    useEffect(() => {
        if (userInfo) {
            setExpenses(userInfo.expenses)
        }
    },[userInfo])

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
            const response = await axios.post('/add-expense', expense, { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                await getUserInfo()
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
        console.log(timePeriod)
        let expensesByType = {};
        const now = new Date();
    
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.expense_date);
    
            let includeExpense = false;
            if (timePeriod === 'today') {
                includeExpense = expenseDate.toDateString() === now.toDateString();
                console.log('include Expense:', includeExpense)
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
        console.log(expensesByType)
        const dataArr = Object.values(expensesByType); // get the amounts
        const labelsArr = Object.keys(expensesByType); // get the labels
        console.log('labels:', labelsArr, "data:", dataArr)
        console.log('data:', dataArr, 'lables:', labelsArr)
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

    const toggleDeleteExpensesMenuOpen = () => {
        if (deleteExpensesListOpen) {
            setDeleteExpensesListOpen(false)
        } else {
            setDeleteExpensesListOpen(true)
        }
    }

    const addExpenseToDeletedExpensesArr = (expenseId) => {
        console.log('overall exe')
        setDeleteExpenseArr(prevArr => {
            console.log('prevArr:', prevArr, 'expenseId:', expenseId)
            const foundId = prevArr.find(id => id === expenseId);
            if (foundId) {
                return prevArr.filter(id => id !== foundId);
            } else {
                return [...prevArr, expenseId];
            }
        });
        console.log(deleteExpensesArr)
    }

    const deleteExpenses = async (event) => {
        event.preventDefault()
        if (deleteExpensesArr.length === 0) {
            setDeleteExpenseCountColor(true)
            return
        }
        setDeleteExpenseLoader(true)
        try {
            const response = await axios({
                method: 'delete',
                url: '/delete-expense',
                data: deleteExpensesArr,
                withCredentials: true
            });
            console.log(response)
            if (response.status === 200) {
                await getUserInfo()
                setDeleteExpenseModalOpen(false)
                setDeleteExpensesListOpen(false)
                setDeleteExpenseArr([])
            }
            setDeleteExpenseLoader(false)
        } catch (err) {
            console.log(err)
            setDeleteExpenseLoader(false)
        }
    }

    useEffect(() => {
        if (deleteExpensesArr.length !== 0) {
            setDeleteExpenseCountColor(false)
        }
    },[deleteExpensesArr])
    
    if (!pieChartData || !yourBarChartData || !yourBarChartOptions) {
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
                        <div className='expenseFooter'>
                            <button className="deleteExpenseBtn" onClick={() => setDeleteExpenseModalOpen(true)}>Delete Expense</button>
                            <button className="addExpenseBtn" onClick={() => setAddExpenseModalOpen(true)}>Add Expense</button>
                        </div>
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
                            <div className="renderedExpenseContent" key={expense.expense_id}>
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
                <AddExpense addExpense={addExpense} expenseTypeMenuOpen={expenseTypeMenuOpen} expenseType={expenseType} 
                handleExpenseTypeMenuToggle={handleExpenseTypeMenuToggle} setExpenseType={setExpenseType}
                setExpenseTypeMenuOpen={setExpenseTypeMenuOpen} redExpenseAmountPlaceHolder={redExpenseAmountPlaceHolder}
                setExpenseAmount={setExpenseAmount} expenseAmount={expenseAmount} expenseDescription={expenseDescription}
                setExpenseDescription={setExpenseDescription} MAX_DESCRIPTION_CHARACTERS={MAX_DESCRIPTION_CHARACTERS}
                closeAddExpenseModal={closeAddExpenseModal} addExpenseLoader={addExpenseLoader}
                expenseDescriptionCharCount={expenseDescriptionCharCount}/>
            )}
            {deleteExpenseModalOpen && (
                <DeleteExpense expenses={expenses} deleteExpensesArr={deleteExpensesArr}
                addExpenseToDeletedExpensesArr={addExpenseToDeletedExpensesArr} deleteExpenses={deleteExpenses} 
                deleteExpenseCountColor={deleteExpenseCountColor} toggleDeleteExpensesMenuOpen={toggleDeleteExpensesMenuOpen}
                deleteExpensesListOpen={deleteExpensesListOpen} setDeleteExpenseCountColor={setDeleteExpenseCountColor} 
                setDeleteExpenseArr={setDeleteExpenseArr} setDeleteExpensesListOpen={setDeleteExpensesListOpen}
                deleteExpenseLoader={deleteExpenseLoader} setDeleteExpenseModalOpen={setDeleteExpenseModalOpen}
                faFileLines={faFileLines} openExpenseDescriptionModal={openExpenseDescriptionModal}/>
            )}
            </section>
            <section className="expenseChartSection">
                <div className="expenseChartWrapper">
                    <Bar 
                        data={yourBarChartData}
                        options={yourBarChartOptions}>
                    </Bar>
                </div>
                <div className={`expensePieChartWrapper ${pieChartData.labels.length === 0 ? 'empty' : ''}`}>
                        <Pie
                            options={pieChartOptions}
                            data={pieChartData}
                            >
                        </Pie>
                </div>
            </section>
        </div>
    )
}

export default ExpenseTracker