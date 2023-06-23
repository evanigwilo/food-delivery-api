// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from '../controllers/restaurantController';

const router = express.Router();

router.post('/', getRestaurants);

router.get('/:restaurantId', getRestaurant);

router.delete('/:restaurantId', authenticateUser(), deleteRestaurant);

router.post('/create', authenticateUser(), createRestaurant);

router.patch('/:restaurantId', authenticateUser(), updateRestaurant);

export default router;
