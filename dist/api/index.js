"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = __importDefault(require("../lib/db"));
const models_1 = __importDefault(require("../lib/models"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, db_1.default)();
app.use(express_1.default.json());
// Serve static files
app.use(express_1.default.static((0, path_1.join)(__dirname, '../public')));
// Root route
app.get('/', (req, res) => {
    res.send('FX Rates Express Server');
});
// Fetch and store FX rates function
const fetchAndStoreFxRates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://fcsapi.com/api-v3/forex/latest?id=1&access_key=K9izZeK9cwB2rKS86EalHszK');
        const rates = response.data.response;
        for (const rate of rates) {
            const newRate = new models_1.default({
                base: rate.base,
                counter: rate.counter,
                rate: rate.price,
                date: new Date(rate.timestamp * 1000)
            });
            yield newRate.save();
        }
        console.log('FX rates fetched and stored.');
    }
    catch (error) {
        console.error('Error fetching FX rates:', error);
    }
});
// Schedule the fetchAndStoreFxRates to run once a day
node_cron_1.default.schedule('0 0 * * *', fetchAndStoreFxRates);
// API route to get FX rate
app.get('/fxrate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { base, counter } = req.query;
    if (!base || !counter) {
        return res.status(400).json({ error: 'Base and counter currencies are required.' });
    }
    const rate = yield models_1.default.findOne({ base, counter }).sort({ date: -1 });
    if (!rate) {
        return res.status(404).json({ error: 'FX rate not found.' });
    }
    res.json(rate);
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
exports.default = app;
