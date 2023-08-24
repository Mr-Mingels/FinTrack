import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ExpenseTracker/AddExpense.css'

const AddExpense = ({ addExpense, expenseTypeMenuOpen, expenseType, handleExpenseTypeMenuToggle, setExpenseType,
    setExpenseTypeMenuOpen, redExpenseAmountPlaceHolder, setExpenseAmount, expenseAmount, expenseDescription,
    setExpenseDescription, MAX_DESCRIPTION_CHARACTERS, closeAddExpenseModal, addExpenseLoader, expenseDescriptionCharCount }) => {

    return (
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
                        {expenseTypeMenuOpen && (
                            <ul className="addExpenseTypeDropDownWrapper">
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Debt Payments"); setExpenseTypeMenuOpen(false) }}>Debt Payments</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Education"); setExpenseTypeMenuOpen(false) }}>Education</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Entertainment"); setExpenseTypeMenuOpen(false) }}>Entertainment</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Food"); setExpenseTypeMenuOpen(false) }}>Food</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Gifts & Donations"); setExpenseTypeMenuOpen(false) }}>Gifts & Donations</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Healthcare"); setExpenseTypeMenuOpen(false) }}>Healthcare</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Housing"); setExpenseTypeMenuOpen(false) }}>Housing</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Insurance"); setExpenseTypeMenuOpen(false) }}>Insurance</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Investments"); setExpenseTypeMenuOpen(false) }}>Investments</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Miscellaneous"); setExpenseTypeMenuOpen(false) }}>Miscellaneous</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Personal Care"); setExpenseTypeMenuOpen(false) }}>Personal Care</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Savings"); setExpenseTypeMenuOpen(false) }}>Savings</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Shopping"); setExpenseTypeMenuOpen(false) }}>Shopping</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Transportation"); setExpenseTypeMenuOpen(false) }}>Transportation</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Travel"); setExpenseTypeMenuOpen(false) }}>Travel</li>
                                <li className="addExpenseDropDownItem"
                                    onClick={() => { setExpenseType("Utilities"); setExpenseTypeMenuOpen(false) }}>Utilities</li>
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
                        value={expenseAmount.value} />
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
                        <button type="button" className="addExpenseModalAddExpenseBtn"><span className="modalLoader"></span></button>
                    ) : (
                        <button type="submit" className="addExpenseModalAddExpenseBtn">Add Expense</button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default AddExpense