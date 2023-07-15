require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const db = require('./controllers/dbController')
const { localStrategy, session: passportSession } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes.js')
const expenseRoutes = require('./routes/expenseRoutes.js')
const budgetRoutes = require('./routes/budgetRoutes')
const app = express()

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000", "https://app-api-chatter-sphere.onrender.com", "http://localhost:5000", "https://eu-chatter-sphere.onrender.com"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
    resave: true,
    saveUninitialized: true
}));

app.use(localStrategy) 
app.use(passportSession)
app.use(authRoutes)
app.use(expenseRoutes)
app.use(budgetRoutes)

app.get('/user-info', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Fetch the user details regardless
            const user = await db('users')
                .where('users.id', req.user.id)
                .select('users.username', 'users.email', 'users.joined').first();
            
            const expensesRows = await db('users')
                .where('users.id', req.user.id)
                .join('expenses', 'users.id', '=', 'expenses.user_id')
                .select('expenses.expense_type', 'expenses.expense_amount', 'expenses.expense_description', 'expenses.expense_date', 'expenses.id')

            const budgetsRows = await db('users')
                .where('users.id', req.user.id)
                .join('budgets', 'users.id', '=', 'budgets.user_id')
                .select('budgets.max_spending', 'budgets.time_frame', 'budgets.created_at', 'budgets.budget_type', 'budgets.id')

            const userDetails = {
                id: user.id,
                username: user.username,
                email: user.email,
                date: user.joined,
                expenses: [],
                budgets: []
            };

            if (expensesRows.length > 0) {
                userDetails.expenses = expensesRows.map(row => ({
                    expense_type: row.expense_type,
                    expense_amount: row.expense_amount,
                    expense_description: row.expense_description,
                    expense_date: row.expense_date,
                    expense_id: row.id
                }));
            }

            if (budgetsRows.length > 0) {
                userDetails.budgets = budgetsRows.map(row => ({
                    max_spending: row.max_spending,
                    time_frame: row.time_frame,
                    created_at: row.created_at,
                    budget_type: row.budget_type,
                    budget_id: row.id
                }));
            }
            
            res.json(userDetails);

        } catch(err) {
            console.log(err);
            res.status(500).send('Server error.');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});