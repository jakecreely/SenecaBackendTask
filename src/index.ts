import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { Server } from 'http'
import { connectToDB } from './db';
import { DEFAULT_PORT } from './config';
import { ServerError, ServerErrorCodes } from './errors/ServerError';

// Routes
import courseRoutes from './routes/courseRoutes'
import { HttpStatusCode } from 'axios';

// TODO: Turn this into a promise as well - handle the errors
export const startServer = () => {
    const app = express();

    connectToDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
        const port = process.env.PORT || DEFAULT_PORT;
        console.log(`Server running on port ${port}!`);
    })

    app.use('/courses', courseRoutes);

    return server;
}

//TODO: Add error codes and more context to the error
export const stopServer = (server : Server) => {
    return new Promise<void>((resolve, reject) => {
        server.close((err) => {
            if (err) {
                const serverError = new ServerError(
                    'Failed to stop server',
                    ServerErrorCodes.CONNECTION_CLOSE_ERROR,
                    HttpStatusCode.InternalServerError
                )
                return reject(serverError);
            }
            console.log('Server stopped successfully.');
            resolve();
        });
    });
}

startServer()