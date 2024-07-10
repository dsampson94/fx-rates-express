import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { join } from 'path';
import axios from 'axios';
import cron from 'node-cron';
import cors from 'cors';
import connectDB from '../lib/db';
import FxRate from '../lib/models';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({
    origin: [
        'http://197.90.38.64:4200',
        'https://197.90.38.64:4200',
        'https://fx-rates.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
}));

app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

app.get('/', (_req: Request, res: Response) => res.send('FX Rates Express Server'));

/**
 * Fetch and store rate from fcsapi
 */
const fetchAndStoreFxRates = async () => {
    try {
        const {data} = await axios.get('https://fcsapi.com/api-v3/forex/latest?id=1&access_key=K9izZeK9cwB2rKS86EalHszK');
        const rates = data.response;
        console.log(rates);
        const ratePromises = rates.map((rate: any) => {
            const timestamp = parseInt(rate.t, 10);
            const rateDate = new Date(timestamp * 1000);
            if (isNaN(rateDate.getTime())) {
                console.error(`Invalid date for rate: ${JSON.stringify(rate)}`);
                return Promise.resolve();
            }

            return FxRate.updateOne(
                {base: rate.s.split('/')[0], counter: rate.s.split('/')[1]},
                {rate: parseFloat(rate.c), date: rateDate},
                {upsert: true}
            );
        });

        await Promise.all(ratePromises);
        console.log('FX rates fetched and stored.');
    } catch (error) {
        console.error('Error fetching FX rates:', error);
    }
};

// Fetch on server start
fetchAndStoreFxRates();

// Schedule fetchAndStoreFxRates
cron.schedule('0 * * * *', fetchAndStoreFxRates);

/**
 * Get latest rate for a base and counter currency
 */
app.get('/fxrate', async (req: Request, res: Response) => {
    const {base, counter} = req.query;
    if (!base || !counter) {
        return res.status(400).json({error: 'Base and counter currencies are required.'});
    }

    try {
        const rate = await FxRate.findOne({base, counter}).maxTimeMS(30000);
        if (!rate) {
            return res.status(404).json({error: 'FX rate not found.'});
        }

        res.json(rate);
    } catch (error) {
        console.error('Error fetching FX rate:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app;
