const express = require('express');
require('dotenv').config();
const { Telegraf } = require('telegraf');
PORT=process.env.PORT;
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
    ctx.reply('Welcome, bro')
})
bot.on('text', ctx => {
    ctx.reply('just text')
})
bot.launch()
let textSend="Привет, я бот";
let token=process.env.BOT_TOKEN;
let chatId=process.env.CHAT_ID;

app.get('/api/text', (req, res) => {
    PostText(token,chatId,textSend);
    // return res.status(200).json({Auth: 0})
})
async function PostText(token,chatId,textSend ) {
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