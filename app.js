import express from 'express';


const app = express();
app.use(express.json());
const PORT = 3030; 











app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
});

