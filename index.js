const express = require('express');
require('dotenv').config();
PORT = process.env.PORT;
const https = require("https");
const {Telegraf} = require('telegraf');
const appController = require('./controllers/appController');
const app = express();
const jsonParser = express.json();
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs');
const path = require("path");
const FileSizeNorm = 15000000;
app.use( '/memo',express.static("./static/files"));
const pathJsonInfo ="./static/json/info.json";
let token = process.env.BOT_TOKEN;
bot.launch();


//-----------------------
app.get("/api2/files", appController.ApiFiles_get);
app.get("/api2/allfilesdelete", appController.ApiFilesDelete_get);
app.post("/api2/message",jsonParser, appController.ApiMessage_post);
//----------------------
bot.start(ctx => {
    ctx.reply("Добро пожаловать в чат-бот Пружанской ТЭЦ!"
    )
})

bot.on(['photo', 'document', 'video'], async (msg) => {
    let pi = "";
    let fileId = "";
    if (msg.update.message.photo) {
        pi = 'photo'
    }
    if (msg.update.message.document) {
        pi = 'document'
    }
    if (msg.update.message.video) {
        pi = 'video'
    }
    const pMsg = msg.update.message;
    const dateMsg = new Date(pMsg.date * 1000).toLocaleString();//дата сообщения
    const idUser = pMsg.from.id;// id пользователя
    const nameUser = pMsg.from.first_name; // имя пользователя
    const caption = pMsg.caption || "";//текст сообщения
    if (pi === 'photo') {
        fileId = pMsg.photo[pMsg.photo.length - 1].file_id
    }//вариант с большим размером
    if (pi === 'video') {
        fileId = pMsg.video.file_id
    };
    if (pi === 'document') {
        fileId = pMsg.document.file_id
    };
    const res = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );
    const rMsg = res.data.result;
    const fileSize = rMsg.file_size;
    if (+fileSize > +FileSizeNorm) {
        msg.reply(`файл слишком большой для загрузки
     (больше ${+FileSizeNorm / 1000000} Мбайт)`);
        return;
    };
    const filePath = rMsg.file_path;
    const fileType = rMsg.file_path.split('.').reverse()[0];
    const fileUniqueId = rMsg.file_unique_id + "." + fileType;
    const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const pathSaveFile = path.join(__dirname + "/static/files", `${fileUniqueId}`);
    downloadFile(downloadURL, pathSaveFile, function () {
        let infoJson = JSON.parse(fs.readFileSync(pathJsonInfo));
        infoJson.messages.files.push({
            "id": fileUniqueId,
            "type": pi,
            "data": dateMsg,
            "file_size": fileSize,
            "idUser": idUser,
            "nameUser": nameUser,
            "caption": caption
        });
        const imf = infoJson.messages;
        imf.countFiles = imf.files.length;
        let data = JSON.stringify(infoJson, null, 2);
        fs.writeFileSync(pathJsonInfo, data);
        //-------------------------------------------------
        console.log(`done:///${fileUniqueId}`);
    });
});


function downloadFile(url, filename, callback) {
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


app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))
