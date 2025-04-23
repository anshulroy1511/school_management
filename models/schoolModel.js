const db = require('../config/db');

class School {
    static async create({ name, address, latitude, longitude }) {
        const [result] = await db.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM schools');
        return rows;
    }

    static async getAllSortedByDistance(userLat, userLon) {
        const schools = await this.getAll();
        
        // Calculate distance for each school and add it to the object
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(
                userLat, 
                userLon, 
                school.latitude, 
                school.longitude
            );
            return { ...school, distance };
        });

        // Sort by distance
        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        
        return schoolsWithDistance;
    }
}

const { calculateDistance } = require('../utils/distanceCalculator');

module.exports = School;