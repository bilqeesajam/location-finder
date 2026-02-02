import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import safetyRoutes from './routes/safetyRoutes.js'; // Note: .js extension is required

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', safetyRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running with ES Modules!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});