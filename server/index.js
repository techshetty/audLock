const express=require('express');
const multer=require('multer');
const cors=require('cors');
const serverless = require('serverless-http');
const {hideMsg,showMsg}=require('./utils/stego.js');
const fs=require('fs')
const path=require('path')
const app=express();
app.use(cors({origin:"*",credentials:false}));
const upload=multer({
  storage:multer.memoryStorage(),limits: {fileSize: 22*1024*1024}
});

app.use(express.json());
app.post('/hide',upload.single('file'),(req,res)=>{
  try{
    const{msg,key,smp}=req.body;
    console.log(smp)
    const fileBuf=(!smp)? (req.file?.buffer):fs.readFileSync(path.join(__dirname,'smp','sample_aud.wav'));
    if(!fileBuf||!msg||!key)return res.status(400).json({error:'Missing file, message, or key'});
    const out=hideMsg(fileBuf,msg,key);
    res.setHeader('Content-Type','audio/wav');
    res.setHeader('Content-Disposition','attachment;filename="stego.wav"');
    res.end(Buffer.from(out));
  } catch(err){
    console.error(err);
    res.status(500).json({error: err.message||'Something went wrong'});
  }
});
app.post('/show',upload.single('file'),(req, res)=>{
  try{
    const fileBuf=req.file?.buffer;
    const{key}=req.body;

    if (!fileBuf||!key)return res.status(400).json({ error: 'Missing file or key' });
    const out=showMsg(fileBuf, key);
    res.json({message:out});
  }catch(err){
    console.error(err);
    res.status(500).json({error: err.message||'Something went wrong'});
  }
});
app.get('/ping',(req,res)=>{
  return res.send("Im up");
})
const PORT=process.env.PORT||8080;
app.listen(PORT,()=>{
  console.log(`AudLock server is running on port ${PORT}`);
});
module.exports.handler=serverless(app,{
  binary: ['audio/wav', 'application/octet-stream', '*/*'],
});