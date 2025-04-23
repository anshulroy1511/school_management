const School = require('../models/schoolModel');

const schoolController = {
    addSchool: async (req, res) => {
        try {
            const { name, address, latitude, longitude } = req.body;

            // Validation
            if (!name || !address || latitude === undefined || longitude === undefined) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
            }

            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                return res.status(400).json({ error: 'Invalid latitude or longitude values' });
            }

            const schoolId = await School.create({ name, address, latitude, longitude });
            
            res.status(201).json({
                message: 'School added successfully',
                schoolId
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    listSchools: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;

            // Validation
            if (latitude === undefined || longitude === undefined) {
                return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
            }

            const userLat = parseFloat(latitude);
            const userLon = parseFloat(longitude);

            if (isNaN(userLat)) {
                return res.status(400).json({ error: 'Latitude must be a number' });
            }

            if (isNaN(userLon)) {
                return res.status(400).json({ error: 'Longitude must be a number' });
            }

            const schools = await School.getAllSortedByDistance(userLat, userLon);
            
            res.status(200).json(schools);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = schoolController;