const express=require('express')
const cors=require('cors')
const app=express();
require('dotenv').config()
const port=process.env.port||8080;
app.use(cors({origin:"*"}))

app.get('/',(req,res)=>{
    res.send("TEST");
})

app.listen(port,()=>{
    console.log(`Server running at port: ${port}`)
})