import { Router } from "express";
import { isAuthenticated, isClient, isAdmin } from "../helpers/auth";
const router = Router();
import { loadAlimentosMenu, loadCrearAlimento, agregarAlimento, eliminarAlimento, loadModificarAlimento, modificarAlimento, asignarTiempoAlimento } from "../controllers/alimentosCRUD.controller"

router.get('/alimentosMenu',isAdmin,loadAlimentosMenu)
router.get('/cargarCrearAlimento',isAdmin,loadCrearAlimento)
router.post('/crearAlimento',isAdmin, agregarAlimento)
router.post('/eliminarAlimento',isAdmin, eliminarAlimento)
router.post('/cargarModificarAlimento',isAdmin,loadModificarAlimento)
router.post('/modificarAlimento',isAdmin,modificarAlimento)
router.post('/asignarTiempoComida',isAdmin,asignarTiempoAlimento)
export default router;