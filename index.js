const express = require('express');
require('dotenv').config();
const https = require("https");
const {Telegraf} = require('telegraf');
const appController = require('./controllers/appController');
PORT = process.env.PORT;
const app = express();
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs');
const path = require("path");
let textSend = "Привет, я бот";
let token = process.env.BOT_TOKEN;
let chatId = process.env.CHAT_ID;
bot.launch();
app.use(express.static(__dirname + "/static/files"));
//app.use(express.static(__dirname + "/static/json"));
const pathJsonFront=__dirname + "/static/json/front.json";
const pathJsonInfo=__dirname + "/static/json/info.json";



app.get("/api2/files", appController.ApiFiles_get);//authentication

app.get('/api/text', (req, res) => {
    PostText(token, chatId, textSend);
    // return res.status(200).json({Auth: 0})
})

bot.start(ctx => {
    ctx.reply('Welcome, bro')
})


bot.on('text', ctx => {
    //----удаление по фильтру------------------------------
    let frontJson = JSON.parse(fs.readFileSync(pathJsonFront));
    let infoJson = JSON.parse(fs.readFileSync(pathJsonInfo));
    for (let item of frontJson.files) {
        if (fs.existsSync(__dirname+`/static/files/${item}`)) {
            try {
                fs.unlinkSync(__dirname+`/static/files/${item}`);
                console.log(`Deleted:${item}`);
            } catch (e) {
                console.log(e);
            }
        }
    }
    const pInf = infoJson.files;
    pInf.photo = pInf.photo.filter(item => !frontJson.files.includes(item.id));
    pInf.countPhoto = pInf.photo.length;
    pInf.countAll = pInf.countPhoto + pInf.countVideo + pInf.countFiles;
    let data = JSON.stringify(infoJson, null, 2);
    fs.writeFileSync(pathJsonInfo, data);
    ctx.reply('just text');
})
bot.on(['photo'], async (msg) => {
    console.log(msg)
    const pMsg = msg.update.message;
    const length = pMsg.photo.length;//кол-во вариантов картинок
    const fileId = pMsg.photo[length - 1].file_id;//вариант с большим размером
    const dateMsg = new Date(pMsg.date * 1000).toLocaleString();//дата сообщения
    const idUser = pMsg.from.id;// id пользователя
    const nameUser = pMsg.from.first_name; // имя пользователя
    const caption = pMsg.caption || "";//текст сообщения
    const res = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );
    const rMsg = res.data.result;
    const filePath = rMsg.file_path;
    const fileSize = rMsg.file_size;
    const fileUniqueId = rMsg.file_unique_id + ".jpg";
    const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const pathSaveFile = path.join(__dirname + "/static/files", `${fileUniqueId}`);
    downloadFile(downloadURL,pathSaveFile,function (){
        let rawData = fs.readFileSync(pathJsonInfo);
        let infoJson = JSON.parse(rawData);
        infoJson.files.photo.push({
            "id": fileUniqueId,
            "data": dateMsg,
            "file_size": fileSize,
            "idUser": idUser,
            "nameUser": nameUser,
            "caption": caption
        });
        const imf = infoJson.files;
        imf.countPhoto = imf.photo.length;
        imf.countAll = imf.countPhoto + imf.countVideo + imf.countFiles;
        let data = JSON.stringify(infoJson, null, 2);
        fs.writeFileSync(pathJsonInfo, data);
        //-------------------------------------------------
        console.log(`done:///${fileUniqueId}`);
    });
});


bot.on(['video'], async (msg) => {
    console.log(msg.update.message.video)
    msg.reply('video');
});

bot.on(['document'], async (msg) => {
    console.log(msg.update.message.document)
    msg.reply('files');
});





function downloadFile(url,filename,callback){
    const req = https.get(url, function (res) {
        const fileStream = fs.createWriteStream(filename)
        res.pipe(fileStream);
        fileStream.on("error", function (err) {
            console.log("Ошибка записи");
            console.log(err);
        });
        fileStream.on("close", function () {
           fileStream.close(callback);
        });

        fileStream.on("finish", function () {
        });
    });
    req.on("error", function (err) {
        console.log("Ошибка загрузки");
        console.log(err);
    })

}
async function PostText(token, chatId, textSend) {
    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: '<b>TEST</b> <a href="https://www.youtube.com/watch?v=CsRqP3xlE8E">inline URL</a>',
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error(error);
    }
}

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))