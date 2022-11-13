import passport from "passport";
const localStrategy = require("passport-local").Strategy;
import { getConnection, querys, sql } from "../database";


passport.use(new localStrategy(
  async (username, password, done) => {
    let clientEmail = '';
    let clientID = 0;
    let userType = 0;
    let shoppingCart = [];
    let shoppingCartBD = [];
    
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('email', username)
        .input('password', password)
        .execute(`verifyLogin`);
      if (result.returnValue != 0) {
        if (result.returnValue == 2) {
          return done(null, false, { message: "Correo no registrado" });
        }
        else if (result.returnValue == 3) {
          return done(null, false, { message: "La combinación de correo y contraseña no fue encontrada." });
        }
      }
      const loginInfo = result.recordset[0];
      clientEmail = loginInfo.email_usuario;
      clientID = loginInfo.IdPersona;
      userType = loginInfo.IdTipoUsuario;
    } catch (error) {
      console.log(error);
    }
    let user = { clientEmail, clientID, userType, shoppingCart,shoppingCartBD};
    return done(null, user, { message: "Usted se ha loggueado exitosamente." });
  }));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((userId, done) => {
  done(null, userId);
});

