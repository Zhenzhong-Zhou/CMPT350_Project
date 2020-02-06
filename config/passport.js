const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, {message: "No user with that email."});
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }else {
                return done(null, false, {message: "Password incorrect"})
            }
        } catch (e) {
            return done(e);
        }
    };
    passport.use(new LocalStrategy({usernameField: "email"}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

module.exports = initialize;

// module.exports =  function (passport) {
//     passport.use(new LocalStrategy(function (username, email, done) {
//         User.findOne({username: username}, function (err, user) {
//             if (err) console.log(err);
//             if (!user) return done(null, false, {messages: "No user found!"});
//             bcrypt.compare(password, user.password, function (err, isMatch) {
//                 if (err) console.log(err);
//                 if (isMatch) {
//                     return done(null, user);
//                 }else {
//                     return done(null, false, {messages: "Wrong Password."});
//                 }
//             })
//         })
//     }));
//     passport.serializeUser(function (user, done) {
//         done(null, user.id)
//     });
//     passport.deserializeUser(function (id, done) {
//         User.findById(id, function (err, user) {
//             done(err, user);
//         })
//     })
// };

