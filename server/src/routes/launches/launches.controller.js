const { Launch } = require('../../models/launches.model');

const getAllLaunches = async (req, res) => {
  try {
    const launches = await Launch.find({}, { '__v': 0 });
    res.status(200).json({
      launches,
      message: 'All launches',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch launches',
    });
  }
};

const getLaunchById = async (req, res) => {
  try {
    const flightNumber = Number(req.params.id);
    const launch = await Launch.findOne({ flightNumber }, { '__v': 0 });
    
    if (!launch) {
      return res.status(404).json({
        error: 'Launch not found',
      });
    }
    
    res.status(200).json(launch);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch launch',
    });
  }
};

const addNewLaunch = async (req, res) => {
  try {
    // Get the latest flight number
    const latestLaunch = await Launch.findOne().sort({ flightNumber: -1 });
    const nextFlightNumber = latestLaunch ? latestLaunch.flightNumber + 1 : 1;
    
    const launchData = {
      ...req.body,
      flightNumber: nextFlightNumber,
      customers: req.body.customers || req.body.customer || [],
      upcoming: true,
      success: true,
    };
    
    const launch = new Launch(launchData);
    await launch.save();
    
    res.status(201).json(launch);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Invalid launch data',
        details: error.message,
      });
    }
    res.status(500).json({
      error: 'Failed to create launch',
    });
  }
};

const abortLaunch = async (req, res) => {
  try {
    const flightNumber = Number(req.params.id);
    const launch = await Launch.findOneAndUpdate(
      { flightNumber },
      { 
        upcoming: false,
        success: false,
      },
      { new: true }
    );
    
    if (!launch) {
      return res.status(404).json({
        error: 'Launch not found',
      });
    }
    
    res.status(200).json({
      ok: true,
      message: 'Launch aborted',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to abort launch',
    });
  }
};

module.exports = {
  getAllLaunches,
  getLaunchById,
  addNewLaunch,
  abortLaunch,
};
