import { getConnection, querys, sql } from "../database";
import fs from 'fs';

export const loadAdminMenu = async (req, res) => {
    try {
        const pool = await getConnection();
        const getClientes = await pool.request()
            .execute(`obtenerClientes`);
        const resultClientes = getClientes.recordset;
        res.render('admin/opcionesAdmin', { resultClientes });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const eliminarCliente = async (req, res) => {
    var { idCliente } = req.body;
    try {
        const pool = await getConnection();
        const resultadoEliminarCliente = await pool.
            request()
            .input('carnet', idCliente)
            .execute(`borrarCliente`);
        console.log(resultadoEliminarCliente);
        console.log(req.body);
        if (resultadoEliminarCliente.returnValue != 0) {
            req.flash("error_msg", "Ocurrió un error a la hora de borrar el cliente, por favor inténtelo de nuevo.");
            res.redirect("/adminMenu");
            return;
        }
        req.flash("success_msg", "El cliente fue borrado exitosamente.");
        res.redirect("/adminMenu");
        return;
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const cargarModificarCliente = async (req, res) => {
    var { idCliente } = req.body;
    try {
        const pool = await getConnection();
        const getInfoCliente = await pool.request()
            .input('carnet', idCliente)
            .execute(`getCliente_carnet`);
        const resultInfoCliente = getInfoCliente.recordset;
        const getPedidosCliente = await pool.request()
            .input('carnetPersona', idCliente)
            .execute(`getHistorialCliente`);
        const resultPedidosCliente = getPedidosCliente.recordset;
        res.render('admin/actualizarUsuario', { resultInfoCliente, resultPedidosCliente })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const modificarCliente = async (req, res) => {
    var { idCliente, name, apellido1, apellido2, carnet, cedula, edad, fechanacimiento, email, contrasena, confirm_password } = req.body
    console.log(fechanacimiento)
    try {
        if (!name) {
            name = null;
        }
        if (!apellido1) {
            apellido1 = null;
        }
        if (!apellido2) {
            apellido2 = null;
        }
        if (!carnet) {
            carnet = null;
        }
        if (!cedula) {
            cedula = null;
        }
        if (!edad) {
            edad = null;
        }
        if (!fechanacimiento) {
            fechanacimiento = null;
        }
        if (!email) {
            email = null;
        }
        if (!contrasena) {
            contrasena = null;
            confirm_password = null;
        }
        if (contrasena != confirm_password) {
            req.flash("error_msg", "Las dos contreñas suministradas no son iguales.");
            res.redirect('/adminMenu');
            return
        }
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('idPersona', idCliente)
            .input('correo', email)
            .input('contrasenia', contrasena)
            .input('nombre', name)
            .input('apellido1', apellido1)
            .input('apellido2', apellido2)
            .input('carnet', sql.Int, carnet)
            .input('cedula', sql.Int, cedula)
            .input('edad', sql.Int, edad)
            .input('fechaNacimiento', fechanacimiento)
            .execute(`actualizarCliente`)
        if (resultado.returnValue == 0) {
            req.flash("success_msg", "Usted ha actualizado al cliente correctamente.");
            res.redirect("/adminMenu");
        }
        else if (resultado.returnValue == 1) {
            req.flash("error_msg", "Uno de los parámetros no fue enviado correctamente, por favor inténtelo de nuevo.");
            res.redirect("/adminMenu");
        }
        else if (resultado.returnValue == 2) {
            req.flash("error_msg", "El id suministrado no pertenece a ningún cliente.");
            res.redirect("/adminMenu");
        }
        else if (resultado.returnValue == 3) {
            req.flash("error_msg", "El carnet suministrado ya se encuentra asociado a una cuenta registrada.");
            res.redirect("/adminMenu");
        }
        else if (resultado.returnValue == 4) {
            req.flash("error_msg", "La cédula suministrada ya se encuentra asociada a una cuenta registrada.");
            res.redirect("/adminMenu");
        }
        else if (resultado.returnValue == 5) {
            req.flash("error_msg", "El correo suministrado ya se encuentra asociado a una cuenta registrada.");
            res.redirect("/adminMenu");
        }
        else {
            req.flash("error_msg", "Error inesperado, por favor inténtelo de nuevo.");
            res.redirect("/adminMenu");
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const loadMenuPedidos = async (req, res) => {
    try {
        const pool = await getConnection();
        const getPedidos = await pool.request()
            .input('idPedido', null)
            .execute(`readPedidos`);
        const resultPedidos = getPedidos.recordset;
        res.render('admin/opcionesPedidos', { resultPedidos });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const loadMenuPedidosId = async (req, res) => {
    try {
        const pool = await getConnection();
        const getPedidos = await pool.request()
            .input('idPedido', req.body.idCompra)
            .execute(`readPedidos`);
        const resultPedidos = getPedidos.recordset;
        if (getPedidos.returnValue == 1) {
            req.flash("error_msg", "Compra no encontrada.");
            res.redirect("/cargarMenuPedidos");
            return;
        }
        res.render('admin/opcionesPedidos', { resultPedidos });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const borrarPedido = async (req, res) => {
    try {
        const pool = await getConnection();
        const resultPedidos = await pool.request()
            .input('idPedido', req.body.idCompra)
            .execute(`borrarPedido`);
        if (resultPedidos.returnValue == 0) {
            req.flash("success_msg", "Pedido borrado exitosamente.");
            res.redirect("/cargarMenuPedidos");
            return;
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const cargarDetallePedido = async (req, res) => {
    try {
        const pool = await getConnection();
        const {idPedido,totalCompra} = req.body
        const getPedidos = await pool.request()
            .input('idCompra', req.body.idCompra)
            .execute(`readPedidosXCompra`);
        const resultPedidos = getPedidos.recordset;
        res.render('pedidos/detallesPedidos', { resultPedidos,idPedido,totalCompra });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const cargarModificarPedido = async (req, res) => {
    try {
        const {idCompra,estadoActual,nombreClienteActual,apellido1Actual,apellido2Actual,idClienteActual,fechaActual} = req.body
        const pool = await getConnection();
        const getClientes = await pool.request()
            .execute(`obtenerClientes`);
        const resultClientes = getClientes.recordset;
        res.render('pedidos/modificarPedido', { resultClientes,idCompra,estadoActual,nombreClienteActual,apellido1Actual,apellido2Actual,idClienteActual,fechaActual });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};