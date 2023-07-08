const express = require('express');
const router = express.Router();
const db = require('../controllers/dbController')

router.post('/add-expense', async (req, res) => {
    try {
        const { expenseType, expenseAmount, expenseDescription } = req.body;
        await db('expenses').insert({
            user_id: req.user.id,
            expense_type: expenseType === 'Expense Type' ? 'Miscellaneous' : expenseType,
            expense_amount: expenseAmount,
            expense_description: expenseDescription ? expenseDescription : "No description made...",
            expense_date: new Date().toISOString(),
        })
        res.status(200).send('Expense added successfully.');
    } catch(err) {
        console.log(err)
        res.status(500).send('Server error.');
    }
})

module.exports = router