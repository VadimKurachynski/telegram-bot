const express = require('express');
require('dotenv').config();
const { Telegraf } = require('telegraf');
PORT=process.env.PORT;
const app = express();
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN)
const text='Привет!'
bot.start(ctx => {
    ctx.reply('Welcome, bro')
})
bot.on('text', ctx => {
    ctx.reply('just text')
})
bot.launch()


app.get('/api/text', (req, res) => {
    res.send('Hello. I changed this text')
    PostText();
})

async function PostText() {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${text}`);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}







app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))