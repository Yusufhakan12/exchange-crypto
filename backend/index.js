require('dotenv').config();
const PORT=process.env.PORT;    
const express=require("express");
const socketIO=require("socket.io");
//call back fonksiyonu ile bağlantıda hata olup olamadığını kontrol ediyoruz
const axios = require('axios');
const app=express();
app.use(express.json());

const server =app.listen(PORT,()=>{

    console.log(`Listening port on ${PORT}`);
});
const socketHandler=socketIO(server);

socketHandler.on("connection",(socket)=>{
    socket.on("disconnect",()=>{
        console.log("Client disconnected!");
    });
    socket.on("connect_error",()=>{
        console.log("Connection error!");
    });
    console.log("client connected!");
});
//server ile sürekli bilgi halinde olup hata olup olmadığını anladım
//crypto ismini postmana yazarak dinlemeyi sağladım 
socketHandler.emit("crypto","hello cryptos Client!");

const getPrices= ()=>{
axios
.get(process.env.LIST_URL,{
    //api sitesindeki limiti kaldırmak için kullanıldı 
    Headers:{
        " x-messari-api-key":process.env.API_KEY,
    },
} )
.then((response)=>{
    //Gerkçek data verilerine ulaşabilmek için iki defa data kullandık 
    //map ifadesini kullanara call back fonksiyonu ile json formatıa çevirdik ve verileri elde ettik 
    const priceList=response.data.data.map((item)=>{
        return {
            id:item.id,
            name:item.symbol,
            price:item.metrics.market_data.price_usd,
        };


    });
    //postmane anlık bilgi gönderebilmek için yani cihazdan verilerin okunabilmesi için emit kkullandık 
    socketHandler.emit("crypto",priceList);

}).catch((err)=>{

    console.log(err);
    //bir hata oluştuğunda kullanıcı cihazında göstermek için kullanıldı 
    socketHandler.emit("crypto",{
        error:true,
        message:"Api bağlantisinda sorun oluştu",
    });
}  
);
};
//postmana sürekli bilgi göndererek her 5 saniyede bir  bilgi alıyoruz 
setInterval(()=>{
    getPrices();
},20000);

app.get('/cryptos/profile',(req,res)=>{

    res.json({
        error:true,
        message:"İd girişi saptanamadi",

    });
});
//id ile para birimi ile alakalı bilgi getirme 
app.get('/cryptos/profile/:id',(req,res)=>{

    const cryptoId=req.params.id;
    axios
    .get(`${process.env.INFO_URL}/${cryptoId}/profile`,{
        //api sitesindeki limiti kaldırmak için kullanıldı 
        Headers:{
            " x-messari-api-key":process.env.API_KEY,
        },
    } )
    .then(resposeData=>{
        res.json(resposeData.data.data);

    }).catch((err)=>{

        console.log(err);
        //bir hata oluştuğunda kullanıcı cihazında göstermek için kullanıldı 
        res.json({
            error:true,
            message:"Api tarafindan bilgi cekilemedi",
        });
    });



});


app.get('/cryptos/market-data',(req,res)=>{

    res.json({
        error:true,
        message:"İd girişi saptanamadi",

    });
});
//id ile para birimi ile alakalı bilgi getirme 
app.get('/cryptos/market-data/:id',(req,res)=>{

    const cryptoId=req.params.id;
    axios
    .get(`${process.env.INFO_URL_V1}/${cryptoId}/metrics/market-data`,{
        //api sitesindeki limiti kaldırmak için kullanıldı 
        Headers:{
            " x-messari-api-key":process.env.API_KEY,
        },
    } )
    .then(resposeData=>{
        res.json(resposeData.data.data);

    }).catch((err)=>{

        console.log(err);
        //bir hata oluştuğunda kullanıcı cihazında göstermek için kullanıldı 
        res.json({
            error:true,
            message:"Api tarafindan bilgi cekilemedi v1",
        });
    });



});