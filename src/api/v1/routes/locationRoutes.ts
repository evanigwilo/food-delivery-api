// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from '../controllers/locationController';

const router = express.Router();

router.post('/', getLocations);

router.get('/:locationId', getLocation);

router.delete('/:locationId', authenticateUser(), deleteLocation);

router.post('/create', authenticateUser(), createLocation);

router.patch('/:locationId', authenticateUser(), updateLocation);

export default router;
