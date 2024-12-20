import 'dotenv/config'
import { connectToDB } from './db';
import { startServer } from './server';

import { ServerError } from './errors/ServerError';
import { DatabaseError } from './errors/DatabaseError';

const initialiseApp = async () => {
    try {
        await startServer();
        await connectToDB();
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.error('Database connection failed:', error.message);
            process.exit(1);
        } else if (error instanceof ServerError) {
            console.error('Server initialization failed:', error.message);
            process.exit(1);
        } else {
            console.error('Unexpected initialization error:', error);
            process.exit(1);
        }
    }
}

initialiseApp()