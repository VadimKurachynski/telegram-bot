const fs = require("fs");
const pathJsonInfo = "./static/json/info.json";
const dir = "./static/files/";
let infoJson = JSON.parse(fs.readFileSync(pathJsonInfo));

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


//  (req.session.isAuth) ? res.status(200).json({Auth: 1}) : res.status(200).json({Auth: 0});


//http://localhost:3002/api2/files?name=comp
//http://localhost:3002/api2/allfilesdelete?name=comp
