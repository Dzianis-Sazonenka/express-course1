const launches = new Map();

const launch = {
  flightNumber: 1,
  mission: 'Kepler-442 b',
  rocket: 'Explorer-1',
  launchDate: new Date('2022-01-01'),
  target: 'Kepler-442 b',
  customer: ['SpaceX', 'NASA'],
  upcoming: true,
  success: true,
  destination: 'Kepler-442 b',
};

launches.set(launch.flightNumber, launch);

module.exports = {
  launches,
};
