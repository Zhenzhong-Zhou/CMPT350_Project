module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please login');
        res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    checkAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    isUser: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please login');
        res.redirect('/login');
    },
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && res.locals.user.admin === 1) {
            next();
        }else {
           req.flash('error_msg', 'Please login as admin.');
           res.redirect("/login");
        }
    }
};
