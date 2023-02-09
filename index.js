
require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN) //сюда помещается токен, который дал botFather

bot.start((ctx) => ctx.reply('Welcome')) //ответ бота на команду /start
bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
bot.on('sticker', (ctx) => ctx.reply('')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
bot.launch() // запуск бота

bot.on("message", (ctx) => {
    console.log(ctx.message.from.first_name)// имя пользователя, который написал
    console.log(ctx.message.text) // текст который пользователь отправил
    console.log(ctx.message.chat.id)//

    bot.telegram.sendMessage(ctx.message.chat.id,
        `Привет, ${ctx.message.from.first_name}\n` +
        `Твой id: ${ctx.message.from.id}`)

});