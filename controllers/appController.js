const fs = require("fs");

exports.ApiFiles_get = (req, res) => {
    const pathJsonInfo="./static/json/info.json";
    console.log(pathJsonInfo)
    let infoJson = JSON.parse(fs.readFileSync(pathJsonInfo));
  //  console.log(infoJson)
   (req.query.name==="comp") ? res.status(200).json(infoJson) : res.status(200).json({Auth: 0});
    console.log(req.query.name)
}

//http://localhost:3002/api/files?name=comp

