import { Router } from "express";
import { getConnection, querys, sql } from "../database";
import passport from "passport";
import { isAuthenticated, isNotAuthenticated, isClient, isAdmin } from "../helpers/auth";
import { registrarUsuario } from "../controllers/users.controller"

const router = Router();

//router.post("/users", verifyLogin);

//router.post("/users", createNewUser);


router.get('/users/signin', isNotAuthenticated, (req, res) => {
  res.render('users/signin');
});

router.get('/users/signup', isNotAuthenticated, (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', isNotAuthenticated, registrarUsuario)

router.get('/', (req, res) => {
  res.render('index');
});


router.get('/users/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash: true,
  successFlash: true
}));

router.post('/users/signup', );


export default router;