const express = require('express');
const router = express.Router();
const db = require('../controllers/dbController')

router.post('/add-budget', async (req, res) => {
    try {
        const { budgetType, budgetTimeFrame, budgetAmount } = req.body;
        await db('budgets').insert({
            user_id: req.user.id,
            budget_type: budgetType === 'Budget Type' ? 'Miscellaneous' : budgetType,
            max_spending: budgetAmount.value,
            time_frame: budgetTimeFrame,
            created_at: new Date().toISOString(),
        })
        res.status(200).send('Expense added successfully.');

    } catch (err) {
        console.log(err)
        res.status(500).send('Server error.');
    }
})

module.exports = router