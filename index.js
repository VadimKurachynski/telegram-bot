const express = require('express');
require('dotenv').config();
const {Telegraf} = require('telegraf');
PORT = process.env.PORT;
const app = express();
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)


bot.start(ctx => {
    ctx.reply('Welcome, bro')
})
bot.on('text', ctx => {
    ctx.reply('just text')
    console.log(ctx.botInfo)
})

// bot.on('photo', ctx => {
//     ctx.reply("photo")
//     console.log(ctx.message)
// })


bot.launch()
let textSend = "Привет, я бот";
let token = process.env.BOT_TOKEN;
let chatId = process.env.CHAT_ID;


app.get('/api/text', (req, res) => {
    PostText(token, chatId, textSend);
    // return res.status(200).json({Auth: 0})
})


bot.on('photo', async (msg) => {
    console.log(msg)
    const length = msg.update.message.photo.length;// кол-во вариантов картинок
    const fileId = msg.update.message.photo[length - 1].file_id; //вариант с большим размером
    const caption = msg.update.message.caption;// текст сообщения
    const timeDate = msg.update.message.date;// текст сообщения
    const dateMsg=new Date(timeDate*1000).toLocaleString();//дата сообщения


    const res = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );
    const filePath = res.data.result.file_path;
    console.log(filePath);


    const downloadURL =
        `https://api.telegram.org/file/bot${token}/${filePath}`;
    console.log(downloadURL);
    // download(downloadURL, path.join(__dirname, `${fileId}.jpg`), () =>
    //     console.log('Done!')
    // );
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