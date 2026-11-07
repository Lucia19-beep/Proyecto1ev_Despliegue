import express from 'express';
import mongoose from 'mongoose';

import routerRecintos from './routes/recintos.js';
import routerEventos from './routes/eventos.js';

mongoose.connect('mongodb://127.0.0.1:27017/eventos');

let app = express();
app.use(express.json());

app.use('/recintos', routerRecintos);
app.use('/eventos', routerEventos);

app.listen(8080);

