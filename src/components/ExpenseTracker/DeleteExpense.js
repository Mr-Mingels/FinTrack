import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ExpenseTracker/DeleteExpense.css'

const DeleteExpense = ({ expenses, deleteExpensesArr, addExpenseToDeletedExpensesArr, deleteExpenses, deleteExpenseCountColor, toggleDeleteExpensesMenuOpen, deleteExpensesListOpen, setDeleteExpenseCountColor, setDeleteExpenseArr, setDeleteExpensesListOpen, deleteExpenseLoader, setDeleteExpenseModalOpen }) => {
    return (
        <div className="deleteExpenseModalWrapper">
            <form className="deleteExpenseModalContent" onSubmit={deleteExpenses}>
                <h3 className="deleteExpenseModalTitle">Delete Expenses</h3>
                <div className="deleteExpenseModalMainContent">
                    <label className="deleteExpensesBtnLabel">Pick expenses you want to delete:<span 
                    className={`${deleteExpenseCountColor ? 'deleteExpenseRedCount' : ''}`}>{deleteExpensesArr.length} / 
                    Selected</span></label>
                    <button type="button" className="deleteExpensesBtn" onClick={() => toggleDeleteExpensesMenuOpen(true)}>Expenses
                    {deleteExpensesListOpen ? (
                        <FontAwesomeIcon className="deleteExpensesAngleUpIcon" icon={faAngleUp} />
                    ) : (
                        <FontAwesomeIcon className="deleteExpensesAngleDownIcon" icon={faAngleDown} />
                    )}
                    {deleteExpensesListOpen && (
                        <div className="deleteExpensesRenderedExpensesWrapper">
                            {expenses.length !== 0 ? (
                                <>
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
                                            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Prefix minutes with 0 
                                                    //if they are less than 10

                                            formattedDate = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
                                        } else {
                                            formattedDate = expenseDate.toISOString().split('T')[0];
                                        }

                                            const formattedAmount = Number(expense.expense_amount).toLocaleString('en-US');

                                            const inDeleteExpensesArr = deleteExpensesArr.find(id => id === expense.expense_id)

                                        return (
                                            <div 
                                                className={`renderedExpenseContent deleteExpenses ${inDeleteExpensesArr ? 'inArr' : ''}`} 
                                                key={expense.expense_id} 
                                                onClick={(event) => {event.stopPropagation(); 
                                                addExpenseToDeletedExpensesArr(expense.expense_id)}}>
                                                <span className="renderedExpenseType deleteExpenses">{expense.expense_type}</span>
                                                <span className="renderedExpenseAmount deleteExpenses">${formattedAmount}</span>
                                                <span className="renderedExpenseDate deleteExpenses">{formattedDate}</span>
                                            </div>  
                                        ) 
                                    })}
                                </>
                            ) : (
                                <span className="noExpensesTxt" 
                                onClick={(event) => event.stopPropagation()}>No expenses have been made...</span>
                            )}        
                        </div>
                    )}</button>
                </div>
                <div className="deleteExpenseModalFooter">
                    <button className="deleteExpensesCloseBtn" onClick={() => {setDeleteExpenseModalOpen(false); 
                        setDeleteExpenseArr([]); setDeleteExpenseCountColor(false); setDeleteExpensesListOpen(false)}}>Close</button>
                        {deleteExpenseLoader ? (
                            <button type="button" className="deleteExpensesDeleteBtn"><span class="modalLoader"></span></button>
                        ) : (
                            <button type='submit' className="deleteExpensesDeleteBtn">Delete</button>                            
                        )}
                </div>
            </form>
        </div>
    )
}

export default DeleteExpense