const fs = require('fs');
const path = require('path');

const limit = 25;
const imgPath = './files/index.jpg';
// 获取文件基本信息（size）
const statInfo = fs.statSync(path.join(__dirname, imgPath));
// 读取图片字段二进制数据（buffer）
const file = fs.readFileSync(path.join(__dirname, imgPath));

if (statInfo.size / 1024 > limit) { // 大于limit直接复制
    fs.writeFileSync(path.join(__dirname, './files/copy.jpg'), file)
} else { // 小于limit 直接转成base64
    const base64 = file.toString('base64');
    console.log(`图片转换成base64：${base64}`)
}
