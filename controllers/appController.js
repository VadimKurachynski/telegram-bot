const fs = require("fs");
const axios = require("axios");
const pathJsonInfo = "./static/json/info.json";
const dir = "./static/files/";
let infoJson = JSON.parse(fs.readFileSync(pathJsonInfo));
let token = process.env.BOT_TOKEN;
let chatId = process.env.CHAT_ID;

exports.ApiFiles_get = (req, res) => {
    let infoJson = JSON.parse(fs.readFileSync(pathJsonInfo));
    (req.query.name === "comp") ? res.status(200).json(infoJson) : res.status(200).json({Auth: 0});
}
exports.ApiFilesDelete_get = (req, res) => {
    let files = [];
    try{
    if (req.query.name === "comp") {
        files = fs.readdirSync(dir);
        for (let item of files) {
            fs.unlinkSync(`./static/files/${item}`);
        }
        const pInf = infoJson.messages;
        pInf.files=[];
        pInf.countFiles = pInf.files.length;
        let data = JSON.stringify(infoJson, null, 2);
         fs.writeFileSync(pathJsonInfo, data);
        res.status(200).json({status: "yesdelete"});
    }
}catch (e){
        res.status(200).json({status: "nodelete"});
    }
};
exports.ApiMessage_post = (req, res) => {
    try {
        if(req.body.typemessage==="prostomessage"){
            PostText(token,chatId,ProstoMessage(req.body));
        }
        res.status(200).json({status: "ок"});
    }catch{ console.error("error")}
}
async function PostText(token, chatId, textSend) {
    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: textSend ,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error(error);
    }
}
ProstoMessage=(body)=>{
    const{text}=body.message;
    return `
${text}
`
};
