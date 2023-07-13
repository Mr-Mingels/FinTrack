import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import '../../styles/BudgetPlanner/ViewExpenses.css'

const ViewExpenses = ({ expenses, budget, openExpenseDescriptionModal, toggleViewExpensesModalOpen, expenseDescription, 
    closeExpenseDescriptionModal, expenseDescriptionModalOpen}) => {
    return (
        <div className="viewExpensesWrapper">
            <div className="viewExpensesContent">
                <h3 className="viewExpensesTitle">View Budget Expenses</h3>
                <div className="viewExpensesMainContent">
                    <div className="allBudgetExpensesWrapper">
                        {expenses
                            .filter(expense => budget.budget_type === expense.expense_type)
                            .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
                            .map((expense) => {
                                // Create date objects
                                const expenseDate = moment(expense.expense_date);
                                const currentDate = moment();

                                // Check if expenseDate is the same day as today, and format accordingly
                                const formattedDate = expenseDate.isSame(currentDate, 'day')
                                    ? expenseDate.format('hh:mm A')
                                    : expenseDate.format('YYYY-MM-DD');

                                const formattedAmount = Number(expense.expense_amount).toLocaleString('en-US');

                                // Further filter expenses by date based on the budget's time frame.
                                let filteredExpenses;
                                switch (budget.time_frame) {
                                    case 'Daily':
                                        filteredExpenses = expenseDate.isSame(currentDate, 'day');
                                        break;
                                    case 'Weekly':
                                        filteredExpenses = expenseDate.isSame(currentDate, 'week');
                                        break;
                                    case 'Monthly':
                                        filteredExpenses = expenseDate.isSame(currentDate, 'month');
                                        break;
                                    case 'Yearly':
                                        filteredExpenses = expenseDate.isSame(currentDate, 'year');
                                        break;
                                    default:
                                        // If the time frame is not recognized, don't filter expenses by date.
                                        break;
                                }

                                // Return the JSX only if the expense meets the time frame filter
                                return filteredExpenses ? (
                                    <div className="renderedBudgetExpenseWrapper">
                                        <span className="renderedBudgetExpense type">{expense.expense_type}</span>
                                        <span className="renderedBudgetExpense amount">${formattedAmount}</span>
                                        <span className="renderedBudgetExpense date">{formattedDate}</span>
                                        <span className="renderedBudgetExpense desc">
                                        <FontAwesomeIcon className="viewExpenseDescIcon" 
                                        icon={faFileLines} onClick={() => openExpenseDescriptionModal(expense.expense_description)}/></span>
                                    </div>  
                                ) : null;
                            })
                        }
                    </div>
                </div>
                <div className="viewExpensesFooter">
                    <button className="viewExpensesBtn close" onClick={() => toggleViewExpensesModalOpen(null)}>Close</button>
                </div>
            </div>
            {expenseDescriptionModalOpen && (
                <div className="viewExpenseDescriptionModalWrapper">
                    <div className="viewExpenseDescriptionModalContent">
                        <h3 className="viewExpenseDescriptionModalTitle">Expense Description</h3>   
                        <textarea className="viewExpenseDescriptionModalDescription" value={expenseDescription} readOnly/>
                        <div className="viewExpenseDescriptionModalFooter">
                            <button className="viewExpenseDescriptionModalCloseBtn" onClick={() => closeExpenseDescriptionModal()}>
                            Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewExpenses