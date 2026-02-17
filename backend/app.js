import express from 'express';

const app = express();

app.get('/', (req,res) => {
    res.send("Backend set up");
})

app.listen(3000, ()=>{
    console.log(`Backend is running on http://localhost:3000`);
})

export default app;