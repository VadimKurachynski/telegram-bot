const express = require('express');
require('dotenv').config();
const {Telegraf} = require('telegraf');
PORT = process.env.PORT;
const app = express();
const download = require('download');
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs');
const path = require("path");
const http = require('https');
request = require('request');

bot.start(ctx => {
    ctx.reply('Welcome, bro')
})
bot.on('text', ctx => {
    ctx.reply('just text')
    console.log(ctx.botInfo)
})



bot.launch()
let textSend = "Привет, я бот";
let token = process.env.BOT_TOKEN;
let chatId = process.env.CHAT_ID;


app.get('/api/text', (req, res) => {
    PostText(token, chatId, textSend);
    // return res.status(200).json({Auth: 0})
})


bot.on(['photo'], async (msg) => {
    const length = msg.update.message.photo.length;//кол-во вариантов картинок
    const fileId = msg.update.message.photo[length - 1].file_id;//вариант с большим размером
    const caption = msg.update.message.caption;//текст сообщения
    const dateMsg = new Date(msg.update.message.date * 1000).toLocaleString();//дата сообщения
    const idUser = msg.update.message.from.id;// id пользователя
    const nameUser = msg.update.message.from.first_name; // имя пользователя

    const res = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );
    const filePath = res.data.result.file_path;
    const fileSize = res.data.result.file_size;
    const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const pathSaveFile=path.join(__dirname+"/static/img", `${caption}.jpg`);


    const download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };
    download(downloadURL, pathSaveFile, function(){
        console.log('done');
    });






//await download2(downloadURL, path2);













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