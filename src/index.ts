import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import axios from 'axios';

// Routes
import courseRoutes from './routes/courseRoutes'

const app = express();
const DEFAULT_PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || DEFAULT_PORT, () => {
    if (process.env.PORT) {
        axios.defaults.baseURL = `http://localhost:${process.env.PORT}`;
        console.log(`Server running on port ${process.env.PORT}!`)
    } else {
        axios.defaults.baseURL = `http://localhost:${DEFAULT_PORT}`;
        console.log(`Server running on port ${DEFAULT_PORT}!`)
    }
})

app.use('/courses', courseRoutes)