require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const db = require('./controllers/dbController')
const { localStrategy, session: passportSession } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes.js')
const expenseRoutes = require('./routes/expenseRoutes.js')
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

app.get('/user-info', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const rows = await db('users')
            .where('users.id', req.user.id) // Assumes req.user.id is available
            .join('expenses', 'users.id', '=', 'expenses.user_id')
            .select('users.username', 'users.email', 'users.joined', 'expenses.expense_type', 'expenses.expense_amount', 'expenses.expense_description', 'expenses.expense_date')
            

            const userDetails = {
              id: rows[0].id,
              username: rows[0].username,
              email: rows[0].email,
              date: rows[0].date,
              expenses: rows.map(row => ({
                  expense_type: row.expense_type,
                  expense_amount: row.expense_amount,
                  expense_description: row.expense_description,
                  expense_date: row.expense_date
              }))
          };

          res.json(userDetails);
      } catch(err) {
          console.log(err);
          res.status(500).send('Server error.');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});