import { Router } from "express";
import { isAuthenticated, isClient, isAdmin } from "../helpers/auth";
const router = Router();
import { loadAdminMenu,eliminarCliente,cargarModificarCliente, modificarCliente, loadMenuPedidos, loadMenuPedidosId, borrarPedido, cargarDetallePedido, cargarModificarPedido } from "../controllers/admin.controller";

router.get('/adminMenu',isAdmin,loadAdminMenu)
router.post('/eliminarCliente',isAdmin,eliminarCliente)
router.post('/cargarModificarCliente',isAdmin,cargarModificarCliente)
router.post('/modificarCliente',isAdmin,modificarCliente)
router.get('/cargarMenuPedidos',isAdmin,loadMenuPedidos)
router.post('/cargarMenuPedidosId',isAdmin,loadMenuPedidosId)
router.post('/borrarCompra',isAdmin,borrarPedido)
router.post('/detalleCompra',isAdmin,cargarDetallePedido)
router.post('/modificarCompra',isAdmin,cargarModificarPedido)

export default router;