const express = require('express');

const {
  getAllLaunches,
  getLaunchById,
  addNewLaunch,
  abortLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);
launchesRouter.get('/launches/:id', getLaunchById);
launchesRouter.post('/launches', addNewLaunch);
launchesRouter.delete('/launches/:id', abortLaunch);

module.exports = launchesRouter;
