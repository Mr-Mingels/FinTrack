import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import '../../styles/BudgetPlanner/AddBudget.css'

const AddBudget = ({ toggleBudgetTypeMenuOpen, budgetType, budgetTypeMenuOpen, setBudgetType, budgetTimeFrameMenuOpen, 
    budgetTimeFrameRedPlaceHolder, toggleBudgetTimeFrameMenuOpen, budgetTimeFrame, setBudgetTimeFrame, 
    budgetAmountRedPlaceHolder, budgetAmount, setBudgetAmount, toggleAddBudgetModalOpen, budgetLoader, handleAddBudget }) => {

    return (
        <div className="addBudgetModalWrapper">
            <form className="addBudgetModalContent" onSubmit={handleAddBudget}>
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
    )
}

export default AddBudget