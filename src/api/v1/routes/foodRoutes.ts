// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import { createFood, deleteFood, getFood, getFoods, updateFood } from '../controllers/foodController';

const router = express.Router();

router.post('/', getFoods);

router.get('/:foodId', getFood);

router.delete('/:foodId', authenticateUser(), deleteFood);

router.post('/create', authenticateUser(), createFood);

router.patch('/:foodId', authenticateUser(), updateFood);

export default router;
