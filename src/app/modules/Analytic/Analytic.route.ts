import express from 'express';
import { AnalyticControllers } from './Analytic.controller';

const router = express.Router();

router.get(
  '/',
  AnalyticControllers.getAllAnalyticsCombined,
);

export const AnalyticRoutes = router;
