const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const db = require('./dbController');

passport.use(new LocalStrategy({ usernameField: 'username', passReqToCallback: true }, async(req, username, password, done) => {
    try {
        const email = req.body.email; // Get the email from the request
        const userByUsername = await db.select('*').from('users').where('username', username) // Look for a user with the username
        const userByEmail = await db.select('*').from('users').where('email', email) // Look for a user with the email
        
        if (!userByEmail && !userByUsername) {
            return done(null, false, { message: "Incorrect email and username" });
        }

        if (!userByEmail) {
            return done(null, false, { message: "Incorrect email" });
        }

        if (!userByUsername) {
            return done(null, false, { message: "Incorrect username" });
        }

        if (userByEmail.email !== userByUsername.email) {
            return done(null, false, { message: "Email and username do not match the same user" });
        }

        const hashedPassword = userByEmail[0].password

        bcrypt.compare(password, hashedPassword, (err, res) => {
            if (err) {
                return done(err);
            }

            if (res) {
                // passwords match! log user in
                return done(null, userByEmail[0]);
            } else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" });
            }
        });
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    console.log("user:", user)
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log("id:", id)
    try {
        const user = await db.select('*').from('users').where('id', id); // Retrieve the user from the users table
        done(null, user[0])
    } catch (err) {
        done(err)
    }
})

module.exports = {
    localStrategy: passport.initialize(),
    session: passport.session()
}