import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { Server } from 'http'
import { connectToDB } from './db';
import { DEFAULT_PORT } from './config';
import { ServerError, ServerErrorCodes } from './errors/ServerError';

// Routes
import courseRoutes from './routes/courseRoutes'
import { DatabaseError } from './errors/DatabaseError';

export const initialiseApp = async () => {
    try {
        await startServer();
        await connectToDB();
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.error('Database connection failed:', error.message);
            process.exit(1); // Exit if the database connection fails
        } else if (error instanceof ServerError) {
            console.error('Server initialization failed:', error.message);
            process.exit(1); // Exit if server initialization fails
        } else {
            console.error('Unexpected initialization error:', error);
            process.exit(1); // Exit on unknown errors
        }
    }
}

export const startServer = (): Promise<Server> => {
    return new Promise<Server>((resolve, reject) => {
        try {
            const app = express();

            app.use(cors());
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));

            const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
                const port = process.env.PORT || DEFAULT_PORT;
                console.log(`Server running on port ${port}!`);
            })

            app.use('/courses', courseRoutes);

            resolve(server);
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
                const serverError = new ServerError(
                    'Failed to stop server',
                    ServerErrorCodes.CONNECTION_CLOSE_ERROR
                )
                return reject(serverError);
            }
            console.log('Server stopped successfully.');
            resolve();
        });
    });
}

initialiseApp()