import { getConnection, querys, sql } from "../database";
import {nodemailer,transporter,sendMail} from "../mailConfig"

export const createNewUser = async (req, res) => {
  try {




    const pool = await getConnection();
    const result = await pool
      .request()
      .input('nickname', req.body.username)
      .input('password', req.body.password)
      .input('full_name', req.body.name)
      .input('country_id', req.body.country)
      .input('email', req.body.email)
      .input('id_subscription', req.body.subscription)
      .execute(`CreateNewUser`);
    const newUser = result.recordset;

    res.json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const loadPageSubscription = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .execute(`getSubscriptionCatalog`);
    const subscriptionInfo = result.recordset;
    const info = req.user.dollarEquivalent;

    for(var k in subscriptionInfo) {
      //subscriptionInfo[k].price_subscription = 
      subscriptionInfo[k].newPrice = subscriptionInfo[k].price_subscription * info;
   }

    res.render("users/subscription", { subscriptionInfo });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addLocation = async (req, res) => {
  try {
    const { markerPositionLat, markerPositionLong, addressName } = req.body;
    Number(markerPositionLat);
    Number(markerPositionLong);
    if (markerPositionLat == '' || markerPositionLong == '') {
      req.flash("error_msg", "Please set the marker by pressing the map before you send the information.");
      res.redirect("/users/addAdress");
      return;
    }
    else {
      const pool = await getConnection();
      const resultAddAdress = await pool.
        request()
        .input('idClient_', req.user.clientID)
        .input('latitude', markerPositionLat)
        .input('longitude', markerPositionLong)
        .input('name', addressName)
        .execute(`insertLocation`);
      const addProduct = resultAddAdress.recordset;
      if (resultAddAdress.returnValue == 2) {
        req.flash("error_msg", "You already have an address with this name, please choose a differente one.");
        res.redirect("/users/addAdress");
        return;
      }
      else if (resultAddAdress.returnValue == 1) {
        req.flash("error_msg", "The address wasn't created due to an error.");
        res.redirect("/users/addAdress");
        return;
      }
      else {
        req.flash("success_msg", "Address saved.");
        res.redirect("/users/addAdress");
        return;
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const changeUserSubscription = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('newPlan', req.body.newSubscription)
      .input('username', req.user.username)
      .execute(`ChangeAccountSubscription`);

    const resultSubs = await pool.request()
      .input('idSubscription', req.body.newSubscription)
      .execute(`getSubscriptionInfo`);
      
    const info = resultSubs.recordset[0];
     //SEND CONFIRMATION MAIL
     let body = '<b> Your subscription purchase is confirmed: ' + info.name_subscription +'</b><br>'
     body = body + 'Price: $'+ info.price_subscription + ' In your money: '+info.price_subscription* req.user.dollarEquivalent  +'</b><br>'
     body = body + 'sales discount: '+ info.discount_subscription + '</b><br>'
     body = body + 'shipping discount: '+ info.discount_shipping + '</b><br>'
     body = body + 'can see special products?: '+ info.special + '</b><br>'
     body = body + 'General description: '+ info.description_subscription + '</b><br>'

    console.log("emaiiil: "+req.user.clientEmail);
    sendMail(req.user.clientEmail, body);
    req.flash("success_msg", "You have changed your account plan.");
    res.redirect("/");
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getInfoChangeAddress = async (req, res) => {
  try {
    const pool = await getConnection();
    const resultUserAddresses = await pool.request()
      .input('idClient_', req.user.clientID)
      .execute(`getUserAddresses`);
    const addressesResult = resultUserAddresses.recordset;
    //console.log(addressesResult);
    res.render('users/changeSelectedAddress', { addressesResult });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const updatePreferredAddress = async (req, res) => {
  try {
    const pool = await getConnection();
    //console.log(req.body.idSelectedAddress);
    const resultUserAddresses = await pool.request()
      .input('idClient_', req.user.clientID)
      .input('preferredLocationId', req.body.idSelectedAddress)
      .execute(`changePreferredAddress`);
    const addressesResult = resultUserAddresses.recordset;
    if (resultUserAddresses.returnValue == 0) {
      req.flash("success_msg", "You have changed your preferred address.");
      res.redirect("/");
    }
    else {
      req.flash("error_msg", "There has been an error on the update of your preferred address, please try again.");
      res.redirect("/users/changeSelectedAddress");
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const registrarUsuario = async (req, res) => {
  try{
    console.log(req.body)
    if (req.body.contrasena != req.body.confirm_password){
      req.flash("error_msg", "Las dos contreñas suministradas no son iguales.");
      res.redirect('signup');
      return
    }
    const pool = await getConnection();
    const resultado = await pool.request()
      .input('email',req.body.email)
      .input('contrasenia',req.body.contrasena)
      .input('nombre',req.body.name)
      .input('apellido1',req.body.apellido1)
      .input('apellido2',req.body.apellido2)
      .input('carnet',sql.Int,req.body.carnet)
      .input('cedula',sql.Int,req.body.cedula)
      .input('edad',sql.Int,req.body.edad)
      .input('fechaNacimiento',req.body.fechanacimiento)
      .execute(`CrearUsuarioNuevo`)
    if (resultado.returnValue == 0) {
      req.flash("success_msg", "Usted se ha registrado correctamente.");
      res.redirect("signin");
    }
    else if (resultado.returnValue == 1) {
      req.flash("error_msg", "Uno de los parámetros no fue enviado correctamente, por favor inténtelo de nuevo.");
      res.redirect("signup");
    }
    else if (resultado.returnValue == 2) {
      req.flash("error_msg", "El correo suminstrado ya se cuenta asociado a una cuenta registrada.");
      res.redirect("signup");
    }
    else if (resultado.returnValue == 3) {
      req.flash("error_msg", "El carnet suministrado ya se encuentra asociado a una cuenta registrada.");
      res.redirect("signup");
    }
    else if (resultado.returnValue == 4) {
      req.flash("error_msg", "La cédula suministrada ya se encuentra asociada a una cuenta registrada.");
      res.redirect("signup");
    }
    else{
      req.flash("error_msg", "Error inesperado, por favor inténtelo de nuevo.");
      res.redirect("signup");
    }
  }catch (error) {
    res.status(500);
    res.send(error.message);
  }
}