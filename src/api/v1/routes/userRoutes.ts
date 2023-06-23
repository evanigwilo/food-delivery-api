// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import { authenticate, login, logout, register } from '../controllers/userController';

const router = express.Router();

router.get('/authenticate', authenticateUser(false), authenticate);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

export default router;
