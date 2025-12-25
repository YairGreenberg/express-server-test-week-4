import express from 'express';
import routerUser from './routes/routUsers.js';
import routerEvent from './routes/routEvent.js';
import routerTickets from './routes/routTickets.js';
import authenticateUser from './middleware/auth.js';

const app = express();
app.use(express.json());
const PORT = 3030; 




app.use('/users',routerUser)
app.use('/creator',authenticateUser,routerEvent)
app.use('/users',authenticateUser,routerTickets)






app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
});

