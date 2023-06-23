// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createCountry,
  deleteCountry,
  getCountry,
  getCountries,
  updateCountry,
} from '../controllers/countryController';

const router = express.Router();

router.post('/', getCountries);

router.get('/:countryId', getCountry);

router.delete('/:countryId', authenticateUser(), deleteCountry);

router.post('/create', authenticateUser(), createCountry);

router.patch('/:countryId', authenticateUser(), updateCountry);

export default router;
