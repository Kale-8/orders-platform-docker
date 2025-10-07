import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import * as productController from '../controllers/product.controller';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.post('/users', userController.createUserHandler);
router.get('/users/:id', userController.getUserHandler);

router.post('/products', productController.createProductHandler);
router.get('/products', productController.listProductsHandler); // soporta ?category=

router.post('/orders', orderController.createOrderHandler);
router.get('/orders/:id', orderController.getOrderHandler);
router.get('/orders', orderController.listOrdersHandler); // soporta filtros

export default router;