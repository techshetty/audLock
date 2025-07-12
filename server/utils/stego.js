const CryptoJS=require('crypto-js');
const encStr=(msg,key)=>{
    return CryptoJS.AES.encrypt(msg,key).toString();
}
const decStr=(msg,key)=>{
    return CryptoJS.AES.decrypt(msg,key).toString(CryptoJS.enc.Utf8);}
const str2BitArr=(str)=>{
 return str.split('').map(char =>char.charCodeAt(0).toString(2).padStart(8,'0')).join('').split('').map(Number);
}
const numTo32BitArr=(num)=>{
  return num.toString(2).padStart(32, '0').split('').map(Number);
};
const bitArr2Str=(bits)=>{
    const res=[]
    for(var i=0;i<bits.length;i+=8){
        const byte=bits.slice(i,i+8).join("")
        res.push(String.fromCharCode(parseInt(byte,2)))
    }
    return res.join("")
}
const encLSB=(pcm,msg)=>{
    const mod=Buffer.from(pcm);
    msg=[...numTo32BitArr(msg.length),...msg]
    for(var i=0;i<msg.length;i++)mod[i]=(mod[i]&0xFE)|msg[i];
    return mod;
}
const decLSB=(pcm,len)=>{
    const res=[]
    for(var i=0;i<len;i++)res.push(pcm[i]&1)
    return res;
}

const hideMsg=(audBuffer,msg,key)=>{
    const encs=encStr(msg,key)
    const mbits=str2BitArr(encs)
    const riff=audBuffer.toString('ascii',0,4);
    if(riff!='RIFF') throw new Error("Audio not supported");
    let offset=12
    let dStart=-1
    let dLen=0
    while(offset<audBuffer.length){
        const cname=audBuffer.toString('ascii',offset,offset+4);
        const chSize=audBuffer.readUInt32LE(offset+4);
        if(cname==='data'){
            dStart=offset+8
            dLen=chSize
            break;
        }
        offset+=(chSize+8)
    }
    if(dStart==-1) throw new Error("No data chunk in audio");
    if(dLen<mbits.length) throw new Error("Audio is too small");

    const header=audBuffer.slice(0,dStart);
    const pcm=audBuffer.slice(dStart,dStart+dLen);
    const tail=audBuffer.slice(dStart+dLen);
    const mod=encLSB(pcm,mbits);
    console.log("Encoded")
    const t=Buffer.concat([header,mod,tail])
    // console.log(showMsg(t,"pgs"))
    return t
}
const showMsg=(audBuffer,key)=>{
    const riff=audBuffer.toString('ascii',0,4);
    if(riff!='RIFF') throw new Error("Audio not supported");
    let offset=12
    let dStart=-1
    let dLen=0
    while(offset<audBuffer.length){
        const cname=audBuffer.toString('ascii',offset,offset+4);
        const chSize=audBuffer.readUInt32LE(offset+4);
        if(cname==='data'){
            dStart=offset+8
            dLen=chSize
            break;
        }
        offset+=(chSize+8)
    }
    if(dStart==-1) throw new Error("No data chunk in audio");
    // if(dLen<mbits.length) throw new Error("small aud");
    const pcm=audBuffer.slice(dStart,dStart+dLen);
    const blen=(parseInt(decLSB(pcm,32).join(''), 2));
    const cipher=bitArr2Str(decLSB(pcm.slice(32),blen))
    const str=decStr(cipher,key)
    if(!str) throw new Error("Failed. Possible causes (wrong key, Invalid audio)")
    console.log("Decoded")
    return str
}
module.exports={hideMsg,showMsg}