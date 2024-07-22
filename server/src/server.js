const app = require('./app');
const connectDb = require('./config/db');
const { serverPort } = require('./secrect');

const startServer = async () => {
    try {
 
        app.listen(serverPort, () => {
            console.log(`Server running successfully at http://localhost:${serverPort}`);
        });

        await connectDb();
    } catch (error) {
        console.error("Failed to start server", error);
    }
    
};

startServer();
