import express from 'express';
import {APP_PORT,DB_URL} from './config';
import routes from './routes/index';
import errorHandler from './middlewares/errorHandler'
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
// Database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected yes new ...');
});


global.APP_ROOT = path.resolve(__dirname);
const app =express();
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/api',routes);
app.use('/uploads',express.static('uploads'));

app.use(errorHandler);

app.listen(APP_PORT,()=> console.log(`listing on ${APP_PORT}`));