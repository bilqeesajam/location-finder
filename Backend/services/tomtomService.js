import axios from 'axios';

export const getSafetyIncidents = async (lat, lon) => {
    const API_KEY = process.env.TOMTOM_API_KEY;
    const offset = 0.1; 
    const bbox = `${parseFloat(lon)-offset},${parseFloat(lat)-offset},${parseFloat(lon)+offset},${parseFloat(lat)+offset}`;

    try {
        const response = await axios.get(`https://api.tomtom.com/traffic/services/5/incidentDetails?key=${API_KEY}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description}}}}&language=en-GB`);
        return response.data.incidents || [];
    } catch (error) {
        console.error("TomTom Service Error:", error.message);
        throw new Error("Could not fetch safety data");
    }
};