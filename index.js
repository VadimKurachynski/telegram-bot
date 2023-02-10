const express = require('express');
require('dotenv').config();
const { Telegraf } = require('telegraf');
PORT=process.env.PORT;
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('Welcome, bro')
})
bot.on('text', ctx => {
    ctx.reply('just text')
})
bot.launch()

let textSend='Привет!';
let token=process.env.BOT_TOKEN;
let chatId=process.env.CHAT_ID;

app.get('/api/text', (req, res) => {
    res.send('Hello. I changed this text')
    PostText(token,chatId,"hfjfjhfjh");
})



async function PostText(token,chatId,textSend ) {
    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: textSend
        });
    } catch (error) {
        console.error(error);
    }
}




app.get('/send', (req, res) => {
    axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.CHAT_ID,
       text: 'Telegram bot'
    });
    res.send('send message');
});





app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))