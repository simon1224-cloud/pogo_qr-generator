import React, {useState,useMemo} from "react";
import {QRCodeCanvas} from "qrcode.react";

export default function App(){
 const [raw,setRaw]=useState("");
 const [expiry,setExpiry]=useState("July 31");
 const codes=useMemo(()=>raw.split(/[\s,;]+/).filter(Boolean),[raw]);
 const url=c=>`https://store.pokemongo.com/offer-redemption?passcode=${c}`;

 return (
  <div style={{padding:20}}>
   <h1>Pogo CIM QR Generator V4</h1>
   <textarea style={{width:"100%",height:120}} value={raw} onChange={e=>setRaw(e.target.value)} />
   <div>Expiry: <input value={expiry} onChange={e=>setExpiry(e.target.value)} /></div>
   <button onClick={()=>window.print()}>Print</button>
   {Array.from({length:Math.ceil(codes.length/9)}).map((_,pi)=>{
    const page=codes.slice(pi*9,pi*9+9);
    return (
     <div key={pi} style={{pageBreakAfter:"always"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
       {Array.from({length:9}).map((_,i)=>{
        const c=page[i];
        return <div key={i} style={{border:"1px solid #999",padding:10,textAlign:"center"}}>
         {c && <>
          <QRCodeCanvas value={url(c)} size={180}/>
          <div>{c}</div>
          <div style={{fontSize:10}}>
           For Pogo CIM members only<br/>
           Contains 1 Raid Pass, 1 Star Piece,<br/>
           1 Egg Incubator, and 1 Incense
          </div>
          <div>Expiry: {expiry}</div>
         </>}
        </div>
       })}
      </div>
     </div>
    )
   })}
  </div>
 )
}
