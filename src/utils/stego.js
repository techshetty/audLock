const CryptoJS=require('crypto-js');
const {WaveFile}=require('wavefile');

const encStr=(msg,key)=>{
    return CryptoJS.AES.encrypt(msg,key).toString();
}
const decStr=(msg,key)=>{
    return CryptoJS.AES.decrypt(msg,key).toString(CryptoJS.enc.Utf8);
}
const str2BitArr=(str)=>{
 return str.split('').map(char =>char.charCodeAt(0).toString(2).padStart(8,'0')).join('').split('').map(Number);
}
const bitArr2Str=(bits)=>{
    const res=[]
    for(var i=0;i<bits.length;i+=8){
        const byte=bits.slice(i,i+8).join("")
        res.push(String.fromCharCode(parseInt(byte,2)))
    }
    return res.join("")
}
const encLSB=(smp,msg)=>{
    const esmp=new Int16Array(smp);
    for(var i=0;i<msg.length;i++)esmp[i]=(esmp[i]&~1)|msg[i];
    return esmp;
}
const decLSB=(smp,len)=>{
    const res=[]
    for(var i=0;i<len;i++)res.push(smp[i]&1)
    return res;
}

const hideMsg=(audBuffer,msg,key)=>{
//
}