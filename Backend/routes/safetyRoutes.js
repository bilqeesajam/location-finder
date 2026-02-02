import express from 'express';
import { getNearbySafetyZones } from '../controllers/safetyController.js';

const router = express.Router();

router.get('/safety', getNearbySafetyZones);

export default router;