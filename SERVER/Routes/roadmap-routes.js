import express from "express";
import {createRoadmap, getAllRoadmap, saveRoadmap, getRoadmap} from '../Controllers/roadmap-controller.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticate, createRoadmap);

router.get('/allroadmap', authenticate, getAllRoadmap);

router.post('/save', authenticate, saveRoadmap);

router.get('/get-roadmap/:id', authenticate, getRoadmap);

export default router;
