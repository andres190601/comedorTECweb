const helpers = {};

helpers.isAuthenticated = (req, res, next)  => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Es necesario tener una sesión activa para ingresar a este apartado');
    res.redirect('/users/signin');
};

helpers.isNotAuthenticated = (req, res, next)  => {
    if(!req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Por favor, cierre la sesión actual para ingresar a esta sección');
    res.redirect('/');
};

helpers.isClient = (req, res, next)  => {
    if(req.isAuthenticated()){
        if(req.user.userType == 1){
        return next();
        }
        req.flash('error_msg','Este apartado es exclusivo para clientes');
        res.redirect('/');
    }
    req.flash('error_msg','Es necesario tener una sesión activa para ingresar a este apartado');
    res.redirect('/users/signin');
};

helpers.isAdmin = (req, res, next)  => {
    if(req.isAuthenticated()){
        if(req.user.userType == 0){
        return next();
        }
        req.flash('error_msg','Este apartado es exclusivo para administradores');
        res.redirect('/');
    }
    req.flash('error_msg','Es necesario tener una sesión activa para ingresar a este apartado');
    res.redirect('/users/signin');
};

module.exports = helpers;