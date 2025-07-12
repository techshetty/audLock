const express=require('express');
const multer=require('multer');
const cors=require('cors');
const {hideMsg,showMsg}=require('./utils/stego.js');
const app=express();
const upload=multer();
app.use(cors());
app.use(express.json());
app.post('/hide',upload.single('file'),(req,res)=>{
  try{
    const fileBuf=req.file?.buffer;
    const{msg,key}=req.body;
    if(!fileBuf||!msg||!key)return res.status(400).json({error:'Missing file, message, or key'});
    const out=hideMsg(fileBuf,msg,key);
    res.setHeader('Content-Type','audio/wav');
    res.setHeader('Content-Disposition','attachment;filename="stego.wav"');
    res.send(out);
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
const PORT=process.env.PORT||8000;
app.listen(PORT,()=>{
  console.log(`AudLock server is running on port ${PORT}`);
});
