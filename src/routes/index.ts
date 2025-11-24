// Rutas principales: usuarios, productos, pedidos
import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import * as productController from '../controllers/product.controller';
import * as orderController from '../controllers/order.controller';

const router = Router();

/* Users */
router.post('/users', userController.createUserHandler);
router.get('/users/:id', userController.getUserHandler);

/* Products */
router.post('/products', productController.createProductHandler);
router.get('/products', productController.listProductsHandler); // soporta ?category=

/* Orders */
router.post('/orders', orderController.createOrderHandler);
router.get('/orders/:id', orderController.getOrderHandler);
router.get('/orders', orderController.listOrdersHandler); // soporta ?status=pending,preparing & ?afterDate=YYYY-MM-DD

export default router;