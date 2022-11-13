import { getConnection, querys, sql } from "../database";

//OBTENER TODOS LOS ALIMENTOS
export const getAlimentos = async (req, res) => {
    try {
        const pool = await getConnection()
        const result = await pool.request()
            .input('idTiempo', 0)
            .input('IdTipo', 0)
            .execute('getAlimentos_filtrosCliente')
        const result_alimentos = result.recordset;
        const getTiempos = await pool.request()
            .execute(`getTiemposComida`);
        const resultTiempos = getTiempos.recordset;
        const get_presentations = await pool.request()
            .execute(`readTipoAlimentoSelect`);
        const result_tipos = get_presentations.recordset;
        res.render('cliente/compra', { result_alimentos, resultTiempos, result_tipos });
        console.log(result_alimentos)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

//OBTENER TODOS LOS ALIMENTOS
export const cargarBusqueda = async (req, res) => {
    try {
        const pool = await getConnection()
        const result = await pool.request()
            .input('idTiempo', req.body.idTiempo)
            .input('IdTipo', req.body.idTipoAlimento)
            .execute('getAlimentos_filtrosCliente')
        const result_alimentos = result.recordset;
        const getTiempos = await pool.request()
            .execute(`getTiemposComida`);
        const resultTiempos = getTiempos.recordset;
        const get_presentations = await pool.request()
            .execute(`readTipoAlimentoSelect`);
        const result_tipos = get_presentations.recordset;
        res.render('cliente/compra', { result_alimentos, resultTiempos, result_tipos });
        console.log(result_alimentos)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const addProductToCart = (req, res) => {
    const { alimentoId, cantidad, alimentoNombre, alimentoPrecio, alimentoTipo } = req.body;
    var boughtProductInfo = {
        idProduct: Number(alimentoId),
        nombre: alimentoNombre,
        tipo: alimentoTipo,
        precio: Number(alimentoPrecio),
        quantity: Number(cantidad),
        subtotal: Number(Number(cantidad) * Number(alimentoPrecio)),
    };

    var boughtProductInfoDB = {
        idAlimento: Number(alimentoId),
        cantidad: Number(cantidad),
    };

    JSON.stringify(boughtProductInfo);
    req.user.shoppingCart.push(boughtProductInfo);
    req.user.shoppingCartBD.push(boughtProductInfoDB);
    res.redirect('/loadAlimento');
};

export const loadCarrito = (req, res) => {
    //sumar subtotales
    var total = 0
    for (var i in req.user.shoppingCart) {
        var val = req.user.shoppingCart[i];

        console.log(val)
        total += val.subtotal;
        console.log(val["subtotal"])

    }
    res.render('cliente/carrito', { total });
};

//CONFIRMAR COMPRA
export const confirmarCompra = async (req, res) => {
    console.log("llegaa")
    console.log(req.user.shoppingCartBD)
    console.log(req.user.clientID)
    try {
        const pool = await getConnection()
        const result = await pool.request()
            .input('jsonAlimentos', JSON.stringify(req.user.shoppingCartBD))
            .input('idCliente', parseInt(req.user.clientID))
            .execute('generarCompra')
        console.log(result)

        req.user.shoppingCart = [];
        req.user.shoppingCartBD = [];
        //res.render('cliente/compra', { result_alimentos, resultTiempos, result_tipos });
    console.log(result_alimentos)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
