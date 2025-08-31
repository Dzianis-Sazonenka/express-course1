const { getAllHabitablePlanets } = require('../../models/planets.schema');

const getAllPlanets = async (req, res) => {
    try {
        const planets = await getAllHabitablePlanets();
        res.status(200).json({
            planets,
            message: 'All planets'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch planets'
        });
    }
}

module.exports = {
    getAllPlanets
}
