const fs = require('fs');
const join = require('path').join;
const parser = require("@babel/parser");
const { transformFromAst } = require("@babel/core");

module.exports = {
    // 获取目标文件夹下所有文件名
    getJsonFiles (jsonPath) {
        let jsonFiles = [];
        function findJsonFile (path) {
            let files = fs.readdirSync(path);
            files.forEach(function (item, index) {
                let fPath = join(path, item);
                let stat = fs.statSync(fPath);
                if(stat.isDirectory() === true) {
                    findJsonFile(fPath);
                }
                if (stat.isFile() === true) { 
                    jsonFiles.push(fPath);
                }
            })
        }
        findJsonFile(jsonPath);
        return jsonFiles;
    },
    getAst: path => {
        const content = fs.readFileSync(path, "utf-8");
        return parser.parse(content, {
            sourceType: "module"
        });
    },
    getCode: ast => {
        const { code } = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        });
        return code;
    },
    createDir: path => {
        let exists = fs.existsSync(path);
        if (!exists) { // 如果不存在 则先创建文件夹
            fs.mkdirSync(path);
        }
    }
}