import { Router } from "express";
import { isAuthenticated, isClient } from "../helpers/auth";
const router = Router();
import {getAlimentos,cargarBusqueda,addProductToCart,loadCarrito,confirmarCompra} from "../controllers/compra.controller";

router.get('/loadAlimento',isClient,getAlimentos)
router.post('/buscarAlimentos',isClient,cargarBusqueda)
router.post('/addProductToCart',isClient,addProductToCart)

router.get('/loadCarrito',isClient, loadCarrito)

router.post('/confirmarCompra',isClient, confirmarCompra)

export default router;