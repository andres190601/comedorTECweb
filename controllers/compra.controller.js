import { getConnection, querys, sql } from "../database";
import { sendMail,createQr } from '../mailConfig';
const { jsPDF } = require("jspdf");

var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


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
        numeroItem: Number(req.user.shoppingCart.length),
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
    try {
        const pool = await getConnection()
        const result = await pool.request()
            .input('jsonAlimentos', JSON.stringify(req.user.shoppingCartBD))
            .input('idCliente', parseInt(req.user.clientID))
            .execute('generarCompra')

        req.user.shoppingCart = [];
        req.user.shoppingCartBD = [];

        const result2 = await pool.request()
            .input('idCompra', 1)
            .input('estado', 1)
            .execute('infoCompra')
        const result_factura = result2.recordset;

        let data = result_factura[0]
        createQr(data)
        var img = base64_encode('qr.jpeg');

        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text('Nombre del cliente: '+result_factura[0].nombreCliente+" "+result_factura[0].apellido1Cliente+" "+result_factura[0].apellido2Cliente,10,10)
        doc.text('Carnet: '+result_factura[0].carnetCliente,10,15)
        doc.text('# de compra: '+result_factura[0].id_compra,10,20)
        doc.text('Fecha: '+result_factura[0].fecha_compra,10,25)
        doc.text('Total: '+result_factura[0].total_compra,10,30)

        const result3 = await pool.request()
            .input('idCompra', Number(result_factura[0].id_compra))
            .execute('readPedidosXCompra')
        const result_lineas = result3.recordset;

        let x = 40
        for(let i = 0; i < result_lineas.length; i++) {
            let obj = result_lineas[i];
            x += i*5
            doc.text(obj.nombre_alimento+"Precio :"+obj.precio_alimento+"Cant: "+obj.cantidad+"Subtotal: "+obj.subtotal,10,40+i*5)
            
        }


        //doc.text("OTROOOO!", 10, 10);
        doc.addImage(img, 'JPEG', 10, x+5, 180, 180);
        doc.save("a4.pdf");

        sendMail(req.user.clientEmail)
    
        res.redirect("/loadCarrito");
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const eliminarDelCarrito = (req, res) => {
    console.log("aquiii")
    console.log(req.body.idItem);
    req.user.shoppingCart.splice(req.body.idItem, 1);
    req.user.shoppingCartBD.splice(req.body.idItem, 1);
    res.redirect("/loadCarrito");
}

