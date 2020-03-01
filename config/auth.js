module.exports = {
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    isUser: function(req, res, next) {
        if (req.isAuthenticated() && res.locals.user.admin === 0) {
            return next();
        }
        req.flash('error_msg', 'Please login');
        res.redirect('/user/login');
    },
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && res.locals.user.admin === 1) {
            next();
        }else {
           req.flash('error_msg', 'Please login as admin.');
           res.redirect("/user/login");
        }
    },
    isSeller: function (req, res, next) {
        if (req.isAuthenticated() && res.locals.user.admin === 2) {
            next();
        }else {
            req.flash('error_msg', 'Please login as seller.');
            res.redirect("/user/login");
        }
    }
};
