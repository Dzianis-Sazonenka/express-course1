const { launches } = require('../../models/launches.mode');

const getAllLaunches = (req, res) => {
  res.status(200).json({
    launches: Array.from(launches.values()),
    message: 'All launches',
  });
};

const getLaunchById = (req, res) => {
  const flightNumber = Number(req.params.id);
  const launch = launches.get(flightNumber);
  
  if (!launch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  
  res.status(200).json(launch);
};

const addNewLaunch = (req, res) => {
  const launch = Object.assign(req.body, {
    flightNumber: launches.size + 1,
    customer: req.body.customer || [],
    upcoming: true,
    success: true,
  });
  
  launches.set(launch.flightNumber, launch);
  
  res.status(201).json(launch);
};

const abortLaunch = (req, res) => {
  const flightNumber = Number(req.params.id);
  const launch = launches.get(flightNumber);
  
  if (!launch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  
  launch.upcoming = false;
  launch.success = false;
  
  res.status(200).json({
    ok: true,
    message: 'Launch aborted',
  });
};

module.exports = {
  getAllLaunches,
  getLaunchById,
  addNewLaunch,
  abortLaunch,
};
