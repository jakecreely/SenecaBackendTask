
import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { Server } from 'http'
import { DEFAULT_PORT } from './config';
import { ServerError, ServerErrorCodes } from './errors/ServerError';

// Routes
import courseRoutes from './routes/courseRoutes'

export const startServer = (): Promise<Server> => {
    return new Promise<Server>((resolve, reject) => {
        try {
            const app = express();

            app.use(cors());
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));

            app.use('/courses', courseRoutes);

            const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
                const port = process.env.PORT || DEFAULT_PORT;
                console.log(`Server running on port ${port}!`);
                console.log(`Server inside callback: ${server}`)
                console.log(server.listening)
                resolve(server)
            })

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to start server due to unexpected error';
            const serverError = new ServerError(
                message,
                ServerErrorCodes.UNKNOWN_ERROR
            )
            reject(serverError)
        }
    })
}

export const stopServer = (server: Server): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        server.close((error) => {
            if (error) {
                console.log(error)
                const serverError = new ServerError(
                    'Failed to stop server',
                    ServerErrorCodes.CONNECTION_CLOSE_ERROR
                )
                reject(serverError);
                return;
            }
            console.log('Server stopped successfully.');
            resolve();
        });
    });
}