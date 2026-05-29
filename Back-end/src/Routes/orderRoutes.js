import { Router } from 'express';
const router  = Router();
import { createOrder, createStripeIntent, getMyOrders, getOrder, updateOrderStatus } from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

router.use(protect); // all order routes require auth

router.post('/',               authorize('customer'),         createOrder);
router.post('/stripe-intent',  authorize('customer'),         createStripeIntent);
router.get ('/my',             authorize('customer'),         getMyOrders);
router.get ('/:id',            getOrder);
router.patch('/:id/status',   authorize('admin', 'seller'),  updateOrderStatus);

export default router;
