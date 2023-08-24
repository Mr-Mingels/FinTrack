const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../controllers/dbController')

router.post('/register', async (req, res) => {
    try {
        const password = req.body.password
        const username = req.body.username.toUpperCase();
        const email = req.body.email.toUpperCase();
        const userByEmail = await db.select('*').from('users').where('email', email)
        const userByUsername = await db.select('*').from('users').where('username', username)
        console.log('userByEmail.email', userByEmail)
        console.log('userByUsername.username', userByUsername)

        if (userByEmail.email && userByUsername.username) {
            return res.status(400).send({ message: "Email and Username have already been taken" });
        }
        
        if (!req.body.email || !req.body.username || !password) {
            return res.status(400).send({ message: "All fields are required" });
        } else if (userByEmail[0] && userByUsername[0]) {
            return res.status(400).send({ message: 'Email and Username have already been taken'})
        } else if (userByEmail[0]) {
            return res.status(400).send({ message: 'Email has already been taken'})
        } else if (userByUsername[0]) {
            return res.status(400).send({ message: 'Username has already been taken'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await db('users').insert({
            email: email,
            username: username,
            password: hashedPassword,
            joined: new Date(),
        })
        return res.status(200).send({ message: 'Created new User' })
    } catch (err) {
        console.log('past catch block')
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
})

router.post('/signin', async (req, res, next) => {
    const password = req.body.password
    const username = req.body.username.toUpperCase();
    const email = req.body.email.toUpperCase();
    const userByEmail = await db.select('*').from('users').where('email', email)
    const userByUsername = await db.select('*').from('users').where('username', username)

    if (userByEmail.length === 0 && userByUsername.length === 0) {
        return res.status(400).send({ message: "Email and Username are incorrect" });
    } else if (userByEmail.length === 0) {
        return res.status(400).send({ message: 'Email is incorrect' });
    } else if (userByUsername.length === 0) {
        return res.status(400).send({ message: 'Username is incorrect' });
    }

    if (!req.body.email || !req.body.username || !password) {
        return res.status(400).send({ message: "All fields are required" });
      } else if (!userByEmail[0].email && !userByUsername[0].username) {
        return res.status(400).send({ message: "Email and Username are incorrect" });
      } else if (!userByEmail[0].email) {
        return res.status(400).send({ message: 'Email is incorrect' });
      } else if (!userByUsername[0].username) {
        return res.status(400).send({ message: 'Username is incorrect' });
      }
    
    passport.authenticate("local", (err, user, info) => {
        if (err) { 
            console.error(`Error: ${err}`);
            return res.status(500).send({ message: `Error: ${err}` });
        }
        if (!user) { 
            console.log('Log in Error:', info)
            return res.status(401).send({ message: `${info.message}` });
        }
        req.logIn(user, function(err) {
            if (err) { 
                console.error(`Error: ${err}`);
                return res.status(500).send({ message: `Error: ${err}` });
            }
            return res.status(200).send({ message: "Authentication succeeded", user });
        });
    })(req, res, next);
});

router.get('/log-out', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        return res.status(200).send({ message: 'Successfully logged out!' })
    })
})

module.exports = router;