const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    mission: {
      type: String,
      required: true,
    },
    rocket: {
      type: String,
      required: true,
    },
    launchDate: {
      type: Date,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    customers: [
      {
        type: String,
      },
    ],
    upcoming: {
      type: Boolean,
      required: true,
      default: true,
    },
    success: {
      type: Boolean,
      required: true,
      default: true,
    },
    destination: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compile model from schema
const Launch = mongoose.model('Launch', launchesSchema);

// Seed data function
async function loadLaunchData() {
    const firstLaunch = await Launch.findOne({
        flightNumber: 1,
        mission: 'Kepler-442 b',
        rocket: 'Explorer-1',
    });

    if (firstLaunch) {
        console.log('Launch data already loaded!');
    } else {
        await populateLaunches();
    }
}

async function populateLaunches() {
    console.log('Downloading launch data...');
    
    const launch = {
        flightNumber: 1,
        mission: 'Kepler-442 b',
        rocket: 'Explorer-1',
        launchDate: new Date('2022-01-01'),
        target: 'Kepler-442 b',
        customers: ['SpaceX', 'NASA'],
        upcoming: true,
        success: true,
        destination: 'Kepler-442 b',
    };

    await saveLaunch(launch);
}

async function saveLaunch(launch) {
    await Launch.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

module.exports = {
    Launch,
    loadLaunchData,
};
