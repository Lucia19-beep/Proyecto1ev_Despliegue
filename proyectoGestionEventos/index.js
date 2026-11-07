import express from 'express';
import mongoose from 'mongoose';

import routerRecintos from './routes/recintos.js';
import routerEventos from './routes/eventos.js';

import 'dotenv/config';
const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventos";
mongoose.connect(DB_URI);

let app = express();
app.use(express.json());

app.use('/recintos', routerRecintos);
app.use('/eventos', routerEventos);

app.listen(8080);

