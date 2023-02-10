const express = require('express');
const {env} = require("telegraf/typings/util");
require('dotenv').config()
PORT=process.env.PORT;

const app = express()

app.get('/', (req, res) => {
    res.send('Hello. I changed this text')
})


app.get('/api/theme', isAuth, dbPg.getQuestionAll);//access to questions






app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))