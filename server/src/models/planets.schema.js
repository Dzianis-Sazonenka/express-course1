const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema(
  {
    kepid: {
      type: Number,
      required: true,
      unique: true,
    },
    kepoi_name: {
      type: String,
      required: true,
    },
    kepler_name: {
      type: String,
      default: '',
    },
    koi_disposition: {
      type: String,
      required: true,
      enum: ['CONFIRMED', 'CANDIDATE', 'FALSE POSITIVE'],
    },
    koi_pdisposition: {
      type: String,
      required: true,
    },
    koi_prad: {
      type: Number,
      required: true,
    },
    koi_teq: {
      type: Number,
    },
    koi_insol: {
      type: Number,
      required: true,
    },
    koi_period: {
      type: Number,
      required: true,
    },
    koi_steff: {
      type: Number,
    },
    koi_srad: {
      type: Number,
    },
    ra: {
      type: Number,
      required: true,
    },
    dec: {
      type: Number,
      required: true,
    },
    koi_kepmag: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

planetsSchema.index({ koi_disposition: 1 });
planetsSchema.index({ kepoi_name: 1 });

planetsSchema.statics.isHabitable = function (planetData) {
  return (
    planetData.koi_disposition === 'CONFIRMED' &&
    planetData.koi_insol > 0.36 &&
    planetData.koi_insol < 1.11 &&
    planetData.koi_prad < 1.6
  );
};

const Planet = mongoose.model('Planet', planetsSchema);

async function loadPlanetsData() {
  const firstPlanet = await Planet.findOne();

  if (firstPlanet) {
    console.log('Planet data already loaded!');
    return;
  }

  return new Promise((resolve, reject) => {
    const path = require('path');
    const { parse } = require('csv-parse');
    const fs = require('fs');

    const planets = [];

    fs.createReadStream(path.join(__dirname, '../../data/kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => {
        const planetData = {
          kepid: parseInt(data.kepid),
          kepoi_name: data.kepoi_name,
          kepler_name: data.kepler_name || '',
          koi_disposition: data.koi_disposition,
          koi_pdisposition: data.koi_pdisposition,
          koi_prad: parseFloat(data.koi_prad),
          koi_teq: data.koi_teq ? parseFloat(data.koi_teq) : undefined,
          koi_insol: parseFloat(data.koi_insol),
          koi_period: parseFloat(data.koi_period),
          koi_steff: data.koi_steff ? parseFloat(data.koi_steff) : undefined,
          koi_srad: data.koi_srad ? parseFloat(data.koi_srad) : undefined,
          ra: parseFloat(data.ra),
          dec: parseFloat(data.dec),
          koi_kepmag: parseFloat(data.koi_kepmag),
        };

        if (Planet.isHabitable(planetData)) {
          planets.push(planetData);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', async () => {
        try {
          if (planets.length > 0) {
            await Planet.insertMany(planets);
            console.log(
              `${planets.length} habitable planets loaded into database!`
            );
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

async function getAllHabitablePlanets() {
  return await Planet.find(
    {
      koi_disposition: 'CONFIRMED',
      koi_insol: { $gt: 0.36, $lt: 1.11 },
      koi_prad: { $lt: 1.6 },
    },
    { __v: 0 }
  );
}

module.exports = {
  Planet,
  loadPlanetsData,
  getAllHabitablePlanets,
};
