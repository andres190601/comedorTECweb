import { getConnection, querys, sql } from "../database";
import fs from 'fs';

export const loadAlimentosMenu = async (req, res) => {
    try {
        const pool = await getConnection();
        const get_presentations = await pool.request()
            .execute(`getAlimentoSelect`);
        const result_alimentos = get_presentations.recordset;
        const getTiempos = await pool.request()
            .execute(`getTiemposComida`);
        const resultTiempos = getTiempos.recordset;
        res.render('CRUD/alimentos/opcionesAlimentos', { result_alimentos, resultTiempos });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const loadCrearAlimento = async (req, res) => {
    try {
        const pool = await getConnection();
        const get_presentations = await pool.request()
            .execute(`readTipoAlimentoSelect`);
        const result_alimentos = get_presentations.recordset;
        res.render('CRUD/alimentos/crearAlimento', { result_alimentos });
        console.log(result_alimentos)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const agregarAlimento = async (req, res) => {
    var { nombre, disponibleRadio, idTipoAlimento, precio } = req.body;
    try {
        const pool = await getConnection();
        const resultadoAddAlimento = await pool.
            request()
            .input('nombreAlimento', nombre)
            .input('disponibilidad', disponibleRadio)
            .input('tipoAlimento', idTipoAlimento)
            .input('precio', precio)
            .execute(`agregarAlimento`);
        if (resultadoAddAlimento.returnValue != 0) {
            req.flash("error_msg", "Ocurrió un error a la hora de crear el alimento, por favor inténtelo de nuevo.");
            res.redirect("/cargarCrearAlimento");
            return;
        }
        req.flash("success_msg", "El alimento fue creado exitosamente.");
        res.redirect("/alimentosMenu");
        return;
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const eliminarAlimento = async (req, res) => {
    var { idAlimento } = req.body;
    try {
        const pool = await getConnection();
        const resultadoEliminarAlimento = await pool.
            request()
            .input('idAlimento', idAlimento)
            .execute(`borrarAlimento`);
        console.log(resultadoEliminarAlimento);
        console.log(req.body);
        if (resultadoEliminarAlimento.returnValue != 0) {
            req.flash("error_msg", "Ocurrió un error a la hora de borrar el alimento, por favor inténtelo de nuevo.");
            res.redirect("/alimentosMenu");
            return;
        }
        req.flash("success_msg", "El alimento fue borrado exitosamente.");
        res.redirect("/alimentosMenu");
        return;
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const loadModificarAlimento = async (req, res) => {
    try {
        const pool = await getConnection();
        const get_presentations = await pool.request()
            .execute(`readTipoAlimentoSelect`);
        const result_alimentos = get_presentations.recordset;
        const getAlimentoInfo = await pool.request()
            .input('idAlimento', req.body.idAlimento)
            .execute(`getAlimentoSelect`);
        const resultAlimentoInfo = getAlimentoInfo.recordset;
        res.render('CRUD/alimentos/modificarAlimentos', { result_alimentos, resultAlimentoInfo });
        console.log(result_alimentos)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const modificarAlimento = async (req, res) => {
    var { nombre, disponibleRadio, idTipoAlimento, precio, alimentoId } = req.body;
    if (!nombre) {
        nombre = null;
    }
    if (idTipoAlimento == 0) {
        idTipoAlimento = null;
    }
    if (!precio) {
        precio = null;
    }
    if (disponibleRadio == 2) {
        disponibleRadio = null;
    }
    try {
        const pool = await getConnection();
        const resultadoAddAlimento = await pool.
            request()
            .input('idAlimento', alimentoId)
            .input('nombreAlimento', nombre)
            .input('disponibilidad', disponibleRadio)
            .input('tipoAlimento', idTipoAlimento)
            .input('precio', precio)
            .execute(`modificarAlimento`);
        if (resultadoAddAlimento.returnValue != 0) {
            req.flash("error_msg", "Ocurrió un error a la hora de modificar el alimento, por favor inténtelo de nuevo.");
            res.redirect("/alimentosMenu");
            return;
        }
        req.flash("success_msg", "El alimento fue modificado exitosamente.");
        res.redirect("/alimentosMenu");
        return;
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const asignarTiempoAlimento = async (req, res) => {
    console.log(req.body)
    var { idAlimento, idTiempo } = req.body;
    try {
        const pool = await getConnection();
        const resultadoAddAlimento = await pool.
            request()
            .input('idAlimento', idAlimento)
            .input('idComida', idTiempo)
            .execute(`asignarTiempoComida`);
        console.log(resultadoAddAlimento)
        if (resultadoAddAlimento.returnValue != 0) {
            if (resultadoAddAlimento.returnValue == 2) {
                req.flash("error_msg", "Por favor, revise que el alimento se encuentre disponible. No se realizó la asignación.");
                res.redirect("/alimentosMenu");
                return;
            }
            if (resultadoAddAlimento.returnValue == 5) {
                req.flash("error_msg", "No se realizó la asignación ya que este alimento ya se encuentra disponible para esta comida para el día de hoy.");
                res.redirect("/alimentosMenu");
                return;
            }
            req.flash("error_msg", "Ocurrió un error a la hora de realizar la asignación, por favor inténtelo de nuevo.");
            res.redirect("/alimentosMenu");
            return;
        }
        req.flash("success_msg", "El alimento fue asignado correctamente.");
        res.redirect("/alimentosMenu");
        return;
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};