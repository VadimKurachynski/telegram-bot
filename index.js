const express = require('express');
require('dotenv').config();
const {Telegraf} = require('telegraf');
PORT = process.env.PORT;
const app = express();
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs');
const path = require("path");
request = require('request');
let textSend = "Привет, я бот";
let token = process.env.BOT_TOKEN;
let chatId = process.env.CHAT_ID;
bot.launch();
app.use(express.static(__dirname + "/static/img"));
app.use(express.static(__dirname + "/static/json"));
app.get('/api/text', (req, res) => {
    PostText(token, chatId, textSend);
    // return res.status(200).json({Auth: 0})
})

bot.start(ctx => {
    ctx.reply('Welcome, bro')
})


bot.on('text', ctx => {

    //----удаление по фильтру------------------------------

    let frontJson = JSON.parse(fs.readFileSync('./static/json/front.json'));
    let infoJson = JSON.parse(fs.readFileSync('./static/json/info.json'));
    infoJson.files.photo = infoJson.files.photo.filter(item => !frontJson.files.includes(item.id));
    infoJson.files.countPhoto = infoJson.files.photo.length;
    let data = JSON.stringify(infoJson, null, 2);
    fs.writeFileSync('./static/json/info.json', data);
    ctx.reply('just text');
})


bot.on(['photo'], async (msg) => {
    const length = msg.update.message.photo.length;//кол-во вариантов картинок
    const fileId = msg.update.message.photo[length - 1].file_id;//вариант с большим размером
    const dateMsg = new Date(msg.update.message.date * 1000).toLocaleString();//дата сообщения
    const idUser = msg.update.message.from.id;// id пользователя
    const nameUser = msg.update.message.from.first_name; // имя пользователя
    const caption = msg.update.message.caption || "";//текст сообщения
    const res = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );
    const filePath = res.data.result.file_path;
    const fileSize = res.data.result.file_size;
    const fileUniqueId = res.data.result.file_unique_id + ".jpg";
    const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const pathSaveFile = path.join(__dirname + "/static/img", `${fileUniqueId}`);

    const download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };
    download(downloadURL, pathSaveFile, function () {

        //---------запись в файл info.json-----------------
        let rawdata = fs.readFileSync('./static/json/info.json');
        let infoJson = JSON.parse(rawdata);
        infoJson.files.photo.push({
            "id": fileUniqueId,
            "data": dateMsg,
            "file_size": fileSize,
            "idUser": idUser,
            "nameUser": nameUser,
            "caption": caption
        });
        infoJson.files.countPhoto = infoJson.files.photo.length;

        let data = JSON.stringify(infoJson, null, 2);
        fs.writeFileSync('./static/json/info.json', data);
        //-------------------------------------------------
        console.log(`done:///${fileUniqueId}`);
    });
});


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