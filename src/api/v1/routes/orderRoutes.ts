// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import { createOrder, getOrder, getOrders, payOrder } from '../controllers/orderController';

const router = express.Router();

router.use(authenticateUser());

router.post('/', getOrders);

router.get('/:orderId', getOrder);

router.post('/create', createOrder);

router.patch('/:orderId', payOrder);

export default router;
