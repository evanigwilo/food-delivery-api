// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import { createMenu, deleteMenu, getMenu, getMenus, updateMenu } from '../controllers/menuController';

const router = express.Router();

router.post('/', getMenus);

router.get('/:menuId', getMenu);

router.delete('/:menuId', authenticateUser(), deleteMenu);

router.post('/create', authenticateUser(), createMenu);

router.patch('/:menuId', authenticateUser(), updateMenu);

export default router;
