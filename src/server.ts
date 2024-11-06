// import { startServer, stopServer } from ".."
// import { connectToDB, disconnectFromDB } from "../db"

//     const testServer = async () => {
//         console.log('Starting test server...');
        
//         // Start the server
//         let server = await startServer();
//         console.log(`Server started on port: ${server}`);
        
//         // Check if the server is listening
//         console.log(`Is server listening? ${server.listening}`);
        
//         // Here you can run other tests or requests against the server

//         // Stop the server after tests
//         await stopServer(server);
//         console.log('Server stopped.');

//         // Disconnect from DB
//         await disconnectFromDB();
//         console.log('Disconnected from DB.');
//     }       
  
//     testServer()