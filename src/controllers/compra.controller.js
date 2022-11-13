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
        res.render('cliente/compra', { result_alimentos,resultTiempos,result_tipos });
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
        res.render('cliente/compra', { result_alimentos,resultTiempos,result_tipos });
        console.log(result_alimentos)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};
