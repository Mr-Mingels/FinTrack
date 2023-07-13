import '../../styles/BudgetPlanner/AddBudgetExpense.css'

const AddBudgetExpense = ({ addExpense, expenseAmount, redExpenseAmountPlaceHolder, setExpenseAmount, expenseDescription, 
    expenseDescriptionCharCount, setExpenseDescription, MAX_DESCRIPTION_CHARACTERS, toggleAddBudgetExpenseModalOpen, budgetLoader }) => {
    return (
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
    )
}

export default AddBudgetExpense