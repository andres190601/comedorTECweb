import { Router } from "express";
import { isAuthenticated, isClient } from "../helpers/auth";
const router = Router();
import {getAlimentos,cargarBusqueda} from "../controllers/compra.controller";

router.get('/loadAlimento',isClient,getAlimentos)
router.post('/buscarAlimentos',isClient,cargarBusqueda)

export default router;