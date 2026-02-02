import { getSafetyIncidents } from '../services/tomtomService.js';

export const getNearbySafetyZones = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitude and Longitude are required." });
        }

        const incidents = await getSafetyIncidents(lat, lon);
        res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};